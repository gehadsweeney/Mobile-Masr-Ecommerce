import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../Services/order-services';
import { Iorder } from '../../../Models/iorder';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.scss']
})
export class OrderDetailsComponent implements OnInit {

  order!: Iorder;
  loading = false;
  errorMessage = '';

  statuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.fetchOrder(orderId);
    } else {
      console.error('No order ID found in route params');
      this.errorMessage = 'Invalid order ID';
    }
  }

  fetchOrder(id: string) {
    this.loading = true;
    this.orderService.getOrderById(id).subscribe({
      next: (res) => {
        this.order = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching order:', err.status, err.message);
        this.loading = false;
        if (err.status === 404) {
          this.errorMessage = 'Order not found. It may have been deleted or the ID is incorrect.';
        } else if (err.status === 401 || err.status === 403) {
          this.errorMessage = 'You do not have permission to view this order.';
        } else {
          this.errorMessage = 'Failed to load order details. Please check your connection and try again.';
        }
      }
    });
  }

changeStatus(status: string) {
  if (!this.order?._id) return;

  // Allow changing even from cancelled if a previousStatus exists
  this.orderService.updateOrderStatus(this.order._id, status).subscribe({
    next: (res) => {
      this.order.orderStatus = res.order.orderStatus;
      this.order.paymentStatus = res.order.paymentStatus;
      this.order.previousStatus = res.order.previousStatus;
      this.order.previousPaymentStatus = res.order.previousPaymentStatus;
    }
  });
}



  getAllowedStatuses(order: Iorder): string[] {
  // If cancelled and a previous status exists, allow reverting to it
  if (order.orderStatus === 'cancelled' && order.previousStatus) {
    return [order.previousStatus];
  }

  // If cancelled with no previousStatus (old orders), allow full set to recover manually
  if (order.orderStatus === 'cancelled' && !order.previousStatus) {
    return ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  }

  const flow: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered', 'cancelled'],
    delivered: ['cancelled'],
    cancelled: []
  };

  return flow[order.orderStatus || ''] || [];
}


  getStatusClass(status?: string) {
    switch (status) {
      case 'pending': return 'status-badge pending';
      case 'confirmed': return 'status-badge confirmed';
      case 'processing': return 'status-badge processing';
      case 'shipped': return 'status-badge shipped';
      case 'delivered': return 'status-badge delivered';
      case 'cancelled': return 'status-badge cancelled';
      default: return 'status-badge';
    }
  }

  getPaymentStatusClass(status?: string) {
    switch (status) {
      case 'paid':
        return 'payment-badge paid';
      case 'pending':
        return 'payment-badge pending';
      case 'refunded':
        return 'payment-badge refunded';
      default:
        return 'payment-badge';
    }
  }
}
