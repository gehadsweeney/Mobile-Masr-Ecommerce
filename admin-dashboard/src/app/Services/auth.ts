import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../Models/login-response';
import { Iuser } from '../Models/iuser';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiBase = environment.apiUrl;
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.apiBase}/auth/login`, { email, password });
  }

  saveUser(data: LoginResponse) {
    localStorage.setItem('token', data.token);
    // Removed saving user to localStorage
  }

  getUser() {
    const token = this.getToken();
    return token ? this.decodeToken(token) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    const payload = this.getUser();
    if (!payload) return null;
    return payload.id || payload._id || payload.userId || payload.sub || null;
  }

  fetchUserById(id: string) {
    const token = this.getToken();
    return this.http.get<{ user: Iuser }>(`${this.apiBase}/admin/users/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  }

  fetchMe() {
    const id = this.getUserId();
    if (!id) {
      throw new Error('No user id found in token');
    }
    return this.fetchUserById(id);
  }

  private decodeToken(token: string) {
    try {
      const payload = token.split('.')[1];
      const decodedStr = atob(payload);
      return JSON.parse(decodedStr);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  logout() {
    localStorage.clear();
  }
}
