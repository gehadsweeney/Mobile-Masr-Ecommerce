import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ireview } from '../Models/ireview';

@Injectable({
  providedIn: 'root',
})
export class ReviewServices {
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
  getAllReviews(): Observable<Ireview[]> {
    return this.http.get<Ireview[]>(`${this.apiUrl}/reviews`);
  }

  deleteReview(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/reviews/${id}`, { headers: this.getHeaders() });
  }
}
