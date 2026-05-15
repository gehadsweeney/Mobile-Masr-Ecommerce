import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ivendor } from '../Models/ivendor';
import { environment } from '../../environments/environment';

interface VendorResponse {
  message?: string;
  vendor?: Ivendor;
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class VendorServices {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==========Headers With Token================
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    });
  }

  // ==========Get-All-Vendors================
  getAllVendors(): Observable<Ivendor[]> {
    return this.http.get<Ivendor[]>(`${this.apiUrl}/vendors`, {
      headers: this.getHeaders(),
    });
  }

  // ==========Get-Vendor-By-ID================
  getVendorById(id: string): Observable<Ivendor> {
    return this.http.get<Ivendor>(`${this.apiUrl}/vendors/${id}` , {
      headers: this.getHeaders(),
    });
  }

  // ==========Add-Vendor================
  addVendor(vendor: Ivendor): Observable<VendorResponse> {
    return this.http.post<VendorResponse>(`${this.apiUrl}/vendors`, vendor, {
      headers: this.getHeaders(),
    });
  }

  // ==========Update-Vendor================
  updateVendor(id: string, vendor: Ivendor): Observable<VendorResponse> {
    return this.http.put<VendorResponse>(`${this.apiUrl}/vendors/${id}`, vendor, {
      headers: this.getHeaders(),
    });
  }

  // ==========Delete-Vendor================
  deleteVendor(id: string): Observable<VendorResponse> {
    return this.http.delete<VendorResponse>(`${this.apiUrl}/vendors/${id}`, {
      headers: this.getHeaders(),
    });
  }
}
