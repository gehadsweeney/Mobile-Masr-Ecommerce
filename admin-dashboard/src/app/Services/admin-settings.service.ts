import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Iuser } from '../Models/iuser';
import { Auth } from './auth';

interface ProfileResponse {
  user: Iuser;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminSettingsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private auth: Auth) {}

  private authHeaders(includeJson = true) {
    const token = this.auth.getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (includeJson) {
      headers['Content-Type'] = 'application/json';
    }

    return headers;
  }

  private requireUserId(): string {
    const id = this.auth.getUserId();
    if (!id) throw new Error('No user id found in token');
    return id;
  }

  getMyProfile(): Observable<ProfileResponse> {
    const id = this.requireUserId();
    return this.http.get<ProfileResponse>(`${this.apiUrl}/admin/users/${id}`, {
      headers: this.authHeaders(false),
    });
  }

  updateMyProfile(payload: Partial<Iuser>): Observable<any> {
    const id = this.requireUserId();
    return this.http.put(`${this.apiUrl}/admin/users/${id}`, payload, {
      headers: this.authHeaders(true),
    });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.put(`${this.apiUrl}/admin/profile-picture`, formData, {
      headers: this.authHeaders(false),
    });
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/auth/change-password`,
      { oldPassword, newPassword },
      { headers: this.authHeaders(true) }
    );
  }
}