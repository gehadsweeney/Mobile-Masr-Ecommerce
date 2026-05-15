import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Iproduct } from '../Models/iproduct';
import { environment } from '../../environments/environment.development';

interface ProductResponse {
  success: boolean;
  message?: string;
  data: Iproduct | Iproduct[];
  totalPages?: number;
  totalProducts?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductServices {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==========Get-Headers-With-Token================
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ==========Get-All-Products================
  getAllProducts(page?: number, search?: string, lang: string = 'ea'): Observable<ProductResponse> {
    const params: any = { lang };
    if (page) {
      params.page = page.toString();
    }
    if (search) {
      params.search = search;
    }
    return this.http.get<ProductResponse>(`${this.apiUrl}/products`, { params });
  }

  // ==========Get-Product-By-ID================
  getProductById(id: string, lang: string = 'ea'): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`, {
      params: { lang },
    });
  }

  // ==========Add-Product================
  addProduct(product: Iproduct): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.apiUrl}/products`, product, {
      headers: this.getHeaders(),
    });
  }

  // ==========Update-Product================
  updateProduct(id: string, product: Iproduct): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.apiUrl}/products/${id}`, product, {
      headers: this.getHeaders(),
    });
  }

  // ==========Delete-Product================
  deleteProduct(id: string): Observable<ProductResponse> {
    return this.http.delete<ProductResponse>(`${this.apiUrl}/products/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
