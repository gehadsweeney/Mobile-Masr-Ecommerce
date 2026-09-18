import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ibrand } from '../Models/ibrand';
import { environment } from '../../environments/environment';

interface BrandResponse {
  message?: string;
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class BrandServices {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==========Get-All-Brands================
  getAllBrands(): Observable<Ibrand[]> {
    return this.http.get<Ibrand[]>(`${this.apiUrl}/brands`);
  }

  // ==========Get-Brand-By-ID================
  getBrandById(id: string): Observable<Ibrand> {
    return this.http.get<Ibrand>(`${this.apiUrl}/brands/${id}`);
  }

  // ==========Add-Brand================
  addBrand(brand: Ibrand): Observable<Ibrand> {
    return this.http.post<Ibrand>(`${this.apiUrl}/brands`, brand);
  }

  // ==========Update-Brand================
  updateBrand(id: string, brand: Ibrand): Observable<Ibrand> {
    return this.http.put<Ibrand>(`${this.apiUrl}/brands/${id}`, brand);
  }

  // ==========Delete-Brand================
  deleteBrand(id: string): Observable<BrandResponse> {
    return this.http.delete<BrandResponse>(`${this.apiUrl}/brands/${id}`);
  }
}
