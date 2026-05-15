import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OpenAiService {
  private API_URL = 'https://api.openai.com/v1/chat/completions';
  private openAiKey: string = '';

  constructor(private http: HttpClient) {
    this.loadApiKey();
  }

  // جيب الـ API Key من الـ backend بشكل آمن
  private loadApiKey() {
    this.http.get<{ key: string }>(`${environment.apiUrl}/config/openai-key`).subscribe(
      (response) => {
        this.openAiKey = response.key;
      },
      (error) => {
        console.error('Failed to load OpenAI key:', error);
      },
    );
  }

  async askAi(inputValue: any) {
    try {
      const systemMessage = `
        You are a professional translator.
        Translate the given English product content into Arabic.
        Return ONLY valid JSON in this format:
        {
          "ar": "translated text"
        }`;

      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.openAiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemMessage },
            { role: 'user', content: JSON.stringify(inputValue) },
          ],
        }),
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error('AI Error:', error);
      return null;
    }
  }
}
