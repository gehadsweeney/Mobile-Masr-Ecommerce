import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private cloudName: string = '';
  private uploadPreset: string = '';

  constructor(private http: HttpClient) {
    this.loadCloudinaryConfig();
  }

  // جيب Cloudinary config من الـ backend بشكل آمن
  private loadCloudinaryConfig() {
    this.http
      .get<{ cloudName: string; uploadPreset: string }>(`${environment.apiUrl}/config/cloudinary`)
      .subscribe(
        (response) => {
          this.cloudName = response.cloudName;
          this.uploadPreset = response.uploadPreset;
        },
        (error) => {
          console.error('Failed to load Cloudinary config:', error);
        },
      );
  }

  uploadImage(file: File): Observable<any> {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    const formData = new FormData();

    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post(url, formData);
  }
}
