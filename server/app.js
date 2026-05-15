import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import mongoose from "mongoose";
import cors from "cors";
const PORT = process.env.PORT;

//========import-swagger========
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";





// ================Import-Routes====================
import productRoutes from "./routes/productRoute.js";
import brandRoutes from "./routes/brandRoute.js";
import wishlistRoute from "./routes/wishlistRoute.js";
import vendorRoutes from "./routes/vendorRoute.js";
import userRoute from "./routes/userRoute.js";
import adminRoutes from "./routes/adminRoute.js";
import categoryRoutes from "./routes/categoryRoute.js";
import cartRoutes from "./routes/cartRoute.js";
import orderRoutes from "./routes/orderRoute.js";
import siteReviewRoutes from "./routes/siteReviewRoutes.js";
import stripeRoutes from "./routes/stripeRoutes.js";
import { webhookHandler } from "./controllers/stripeController.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import configRoutes from "./routes/configRoute.js";











// ================connectDB=================
import { connectDB } from "./config/connectDB.js";
connectDB();


//==============Middleware===============
// Webhook route MUST be before express.json() to receive raw body
app.post("/stripe/webhook", express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json());
app.use(cors())






// =============Routes====================
app.get("/", (req, res) => {
  res.send("Welcome to Mobile Masr API");
});
app.use("/track", visitRoutes);
app.use("/products", productRoutes);
app.use("/brands", brandRoutes);
app.use("/wishlist", wishlistRoute);
app.use("/vendors", vendorRoutes);
app.use("/auth", userRoute);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/reviews", siteReviewRoutes);
app.use("/stripe", stripeRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/ai", aiRoutes);
app.use("/config", configRoutes);









// =======swagger-setup========
const swaggerOptions = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Final Project swagger API",
      version: "1.0.0",
      description: "API documentation for Final Project",
    },
    servers: [
      {
        url: process.env.swaggerURL,
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./app.js", "./routes/*.js"],
});



app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerOptions));









mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

export default app;


