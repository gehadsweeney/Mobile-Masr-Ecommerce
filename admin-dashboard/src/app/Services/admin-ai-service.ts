import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AdminAIRequest {
  question: string;
}

export interface AdminAIResponse {
  answer: string;
  dataUsed: {
    sales: number;
    products: number;
    customers: number;
    topProducts: number;
    lowStockCount: number;
  };
  timestamp: string;
  structuredData?: {
    profits?: any;
    charts?: any[];
    productCards?: any[];
    perAdminShare?: {
      today: number;
      month: number;
      year: number;
    };
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  dir?: 'ltr' | 'rtl';
}

@Injectable({
  providedIn: 'root'
})
export class AdminAIService {
  private apiUrl = `${environment.apiUrl}/admin/ai-chat`;

  constructor(private http: HttpClient) { }

  askQuestion(question: string): Observable<AdminAIResponse> {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    return this.http.post<AdminAIResponse>(this.apiUrl, { question }, { headers });
  }
}

