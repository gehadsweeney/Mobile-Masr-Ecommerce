import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class dashboardService {
  private API = `${environment.apiUrl}/dashboard/overview`;
  constructor(private http: HttpClient){}
  
   getOverview(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(this.API, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
  }
  
}
