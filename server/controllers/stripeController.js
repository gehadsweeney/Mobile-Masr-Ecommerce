// controllers/stripeController.js
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import { getStripe } from "../config/stripeClient.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";


export const createCheckoutSession = async (req, res) => {
    try {
        const stripe = getStripe();

        const userId = req.user._id;
        const { shippingAddress } = req.body;

        // Validate shipping address
        if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
            !shippingAddress.governorate || !shippingAddress.city || !shippingAddress.street) {
            return res.status(400).json({ message: "Complete shipping address is required" });
        }

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0)
            return res.status(400).json({ message: "Cart is empty" });

        const lineItems = cart.items.map((item) => ({
            price_data: {
                currency: "egp",
                product_data: {
                    name: item.product.name?.en || item.product.name?.ar || item.product.name,
                },
                unit_amount: Math.round(item.price * 100), // Stripe takes price in cents
            },
            quantity: item.quantity,
        }));

        // Add shipping fees as a separate line item
        const shippingFees = 100;
        lineItems.push({
            price_data: {
                currency: "egp",
                product_data: {
                    name: "Shipping Fees",
                    description: "Delivery charges"
                },
                unit_amount: Math.round(shippingFees * 100), // 100 EGP = 10000 cents
            },
            quantity: 1,
        });

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: `${process.env.FRONTEND_URL}/cart/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart/checkout`,
            metadata: {
                userId: userId.toString(),
                cartId: cart._id.toString(),
                shippingAddress: JSON.stringify(shippingAddress),
            },
        });

        res.json({ url: session.url, sessionId: session.id });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Stripe error", error: err.message });
    }
};

export const verifySession = async (req, res) => {
    let deductedItems = [];
    try {
        const stripe = getStripe();

        const { session_id } = req.query;

        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status === "paid") {
            // Get cart and user data from metadata
            const userId = session.metadata.userId;
            const cartId = session.metadata.cartId;
            const shippingAddress = JSON.parse(session.metadata.shippingAddress);

            // Get cart items
            const cart = await Cart.findById(cartId).populate("items.product");

            if (!cart) {
                return res.status(404).json({ message: "Cart not found" });
            }

            // Check stock then deduct immediately (online)
            for (const item of cart.items) {
                const updated = await Product.findOneAndUpdate(
                    {
                        _id: item.product._id,
                        stock: { $gte: item.quantity }
                    },
                    {
                        $inc: {
                            stock: -item.quantity,
                            sale: item.quantity
                        }
                    },
                    { new: true }
                );

                if (!updated) {
                    for (const rollbackItem of deductedItems) {
                        await Product.findByIdAndUpdate(rollbackItem.productId, {
                            $inc: {
                                stock: rollbackItem.quantity,
                                sale: -rollbackItem.quantity
                            }
                        });
                    }

                    return res.status(400).json({
                        message: `Insufficient stock for product: ${item.product.name?.en || item.product.name}`
                    });
                }

                deductedItems.push({ productId: item.product._id, quantity: item.quantity });
            }

            // Create order items snapshot
            const items = cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                price: item.price,
            }));

            // Calculate totals
            const subtotal = cart.totalPrice;
            const shippingFees = 100; // Fixed shipping fee
            const totalAmount = subtotal + shippingFees;

            // Create order
            const order = await Order.create({
                user: userId,
                items,
                shippingAddress,
                paymentMethod: "online",
                paymentStatus: "paid",
                orderStatus: "pending",
                subtotal,
                shippingFees,
                totalAmount,
                stockDeducted: true
            });

            // Clear cart
            cart.items = [];
            await cart.save();

            return res.json({
                message: "Payment verified successfully",
                order,
                session: {
                    id: session.id,
                    payment_status: session.payment_status,
                    amount_total: session.amount_total / 100,
                }
            });
        } else {
            return res.status(400).json({
                message: "Payment not completed",
                payment_status: session.payment_status
            });
        }
    } catch (err) {
        if (deductedItems.length) {
            for (const rollbackItem of deductedItems) {
                await Product.findByIdAndUpdate(rollbackItem.productId, {
                    $inc: {
                        stock: rollbackItem.quantity,
                        sale: -rollbackItem.quantity
                    }
                });
            }
        }
        console.log(err);
        res.status(500).json({ message: "Error verifying payment", error: err.message });
    }
};

export const webhookHandler = async (req, res) => {
    const stripe = getStripe();
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.log('Webhook secret not configured');
        return res.status(400).json({ message: 'Webhook secret not configured' });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.log(`Webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            console.log('Payment successful:', session.id);
            // Order is created in verifySession endpoint when user returns
            break;

        case 'payment_intent.payment_failed':
            const paymentIntent = event.data.object;
            console.log('Payment failed:', paymentIntent.id);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};