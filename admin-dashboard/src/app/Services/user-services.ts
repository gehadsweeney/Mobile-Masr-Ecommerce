import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Iuser } from '../Models/iuser';
import { environment } from '../../environments/environment';

interface UsersResponse {
  users: Iuser[];
  totalPages: number;
  totalUsers: number;
}

interface UserResponse {
  user: Iuser;
}

interface DeleteUserResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserServices {
  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  // ==========Get-Headers-With-Token================
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ==========Get-All-Users================
  getAllUsers(page?: number, search?: string): Observable<UsersResponse> {
    const params: any = {};
    if (page) params.page = page.toString();
    if (search) params.search = search;
    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, {
      params,
      headers: this.getHeaders(),
    });
  }

  // ==========Get-User-By-ID================
  getUserById(id: string): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.apiUrl}/users/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ==========Update-User================
  updateUser(id: string, user: Partial<Iuser>): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/users/${id}`, user, {
      headers: this.getHeaders(),
    });
  }

  // ==========Delete-User================
  deleteUser(id: string, hard: boolean = false): Observable<DeleteUserResponse> {
    if (hard) {
      return this.http.delete<DeleteUserResponse>(`${this.apiUrl}/users/${id}`, {
        headers: this.getHeaders(),
        params: { hard: 'true' } as Record<string, string>,
      });
    } else {
      return this.http.delete<DeleteUserResponse>(`${this.apiUrl}/users/${id}`, {
        headers: this.getHeaders(),
      });
    }
  }

  // ==========Update-Profile-Picture (Admin Only)================
  updateProfilePicture(formData: FormData): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.apiUrl}/profile-picture`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      }),
    });
  }
}
