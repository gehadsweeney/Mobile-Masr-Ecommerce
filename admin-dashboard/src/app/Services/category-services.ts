import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Icategory } from '../Models/icategory';
import { environment } from '../../environments/environment';

interface CategoryResponse {
  message?: string;
  error?: any;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryServices {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ==========Get-All-Categories================
  getAllCategories(): Observable<Icategory[]> {
    return this.http.get<Icategory[]>(`${this.apiUrl}/categories`);
  }

  // ==========Get-Category-By-ID================
  getCategoryById(id: string): Observable<Icategory> {
    return this.http.get<Icategory>(`${this.apiUrl}/categories/${id}`);
  }

  // ==========Add-Category================
  addCategory(category: Icategory): Observable<Icategory> {
    return this.http.post<Icategory>(`${this.apiUrl}/categories`, category);
  }

  // ==========Update-Category================
  updateCategory(id: string, category: Icategory): Observable<Icategory> {
    return this.http.put<Icategory>(`${this.apiUrl}/categories/${id}`, category);
  }

  // ==========Delete-Category================
  deleteCategory(id: string): Observable<CategoryResponse> {
    return this.http.delete<CategoryResponse>(`${this.apiUrl}/categories/${id}`);
  }
}
