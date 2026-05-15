import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Iorder } from '../Models/iorder';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) {}
  
  // ==========Get-Headers-With-Token================
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Admin - Get all orders
  getAllOrdersAdmin(page: number = 1, search: string = '', limit: number = 15): Observable<any> {
    const params: any = { 
      page: page.toString(),
      limit: limit.toString()
    };
    if (search) params.search = search;
    
    return this.http.get<any>(`${environment.apiUrl}/orders/admin/all`, { 
      headers: this.getHeaders(),
      params 
    });
  }

  // User - Get user's orders
  getUserOrders(): Observable<Iorder[]> {
    return this.http.get<Iorder[]>(`${environment.apiUrl}/orders/user`, { headers: this.getHeaders() });
  }

  // Admin - Get order details
  getOrderById(id: string): Observable<Iorder> {
    return this.http.get<Iorder>(`${environment.apiUrl}/orders/${id}`, { headers: this.getHeaders() });
  }

// Admin - Update order status
updateOrderStatus(orderId: string, status: string): Observable<any> {
  return this.http.put<any>(`${environment.apiUrl}/orders/${orderId}`, {
    orderStatus: status
  }, { headers: this.getHeaders() });
}

  // Admin - Update payment status
  updatePaymentStatus(orderId: string, paymentStatus: string): Observable<any> {
    return this.http.put(`${environment.apiUrl}/orders/${orderId}`, {
      paymentStatus
    }, { headers: this.getHeaders() });
  }


  // Admin - Delete order
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(`${environment.apiUrl}/orders/${orderId}`, { headers: this.getHeaders() });
  }
}