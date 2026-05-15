import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../Services/order-services';
import { Iorder } from '../../../Models/iorder';
import { Loader } from '../../loader/loader';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Loader],
  templateUrl: './order-list.html',
  styleUrls: ['./order-list.scss']
})
export class OrderListComponent implements OnInit {

  orders: Iorder[] = [];
  loading = false;
  deletePopupVisible = false;
  deleteId: string | null = null;
  search: string = '';
  
  page: number = 1;
  totalPages: number = 1;
  totalOrders: number = 0;
  limit: number = 15;
  
  Math: Math = Math;

  statuses = [
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
  ];

  paymentStatuses: Array<Iorder['paymentStatus']> = [
    'pending',
    'paid',
    'refunded',
  ];


  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.page = +params['page'] || 1;
      this.search = params['search'] || '';
      this.fetchOrders();
    });
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getAllOrdersAdmin(this.page, this.search, this.limit).subscribe({
      next: (res) => {
        this.orders = res.data || res;
        this.totalPages = res.totalPages || 1;
        this.totalOrders = res.totalOrders || res.data?.length || 0;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

changeStatus(id: string, status: string) {
  this.orderService.updateOrderStatus(id, status).subscribe({
    next: (res) => {
      const order = this.orders.find(o => o._id === id);
      if (order) {
        order.orderStatus = res.order.orderStatus;
        order.paymentStatus = res.order.paymentStatus;
        order.previousStatus = res.order.previousStatus;
        order.previousPaymentStatus = res.order.previousPaymentStatus;
      }
    }
  });
}



  changePaymentStatus(orderId: string, paymentStatus?: Iorder['paymentStatus']) {
    const nextStatus: string = paymentStatus ?? 'pending';
    this.orderService.updatePaymentStatus(orderId, nextStatus).subscribe({
      next: () => {
        const order = this.orders.find((o) => o._id === orderId);
        if (order) {
          order.paymentStatus = nextStatus as Iorder['paymentStatus'];
        }
      },
    });
  }


  viewOrder(orderId: string) {
    this.router.navigate(['/admin/orders', orderId]);
  }

  showDeletePopup(orderId: string) {
    this.deleteId = orderId;
    this.deletePopupVisible = true;
  }

  // ================= Pagination =================
  handlePage(action: 'first' | 'prev' | 'next' | 'last') {
    let newPage = this.page;

    if (action === 'first') newPage = 1;
    else if (action === 'prev' && this.page > 1) newPage--;
    else if (action === 'next' && this.page < this.totalPages) newPage++;
    else if (action === 'last') newPage = this.totalPages;

    this.router.navigate([], {
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }

  get hasSearch(): boolean {
    return !!this.search;
  }

  clearSearch() {
    this.router.navigate([], {
      queryParams: { search: null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  confirmDelete() {
    if (!this.deleteId) return;
    this.orderService.deleteOrder(this.deleteId).subscribe(() => {
      this.orders = this.orders.filter(o => o._id !== this.deleteId);
      this.deletePopupVisible = false;
      this.deleteId = null;
    });
  }

 getAllowedStatuses(order: Iorder): string[] {
  // If cancelled and we have a stored previous status, allow reverting to it
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
      case 'pending':
        return 'status-badge pending';
      case 'confirmed':
        return 'status-badge confirmed';
      case 'processing':
        return 'status-badge processing';
      case 'shipped':
        return 'status-badge shipped';
      case 'delivered':
        return 'status-badge delivered';
      case 'cancelled':
        return 'status-badge cancelled';
      default:
        return 'status-badge';
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
