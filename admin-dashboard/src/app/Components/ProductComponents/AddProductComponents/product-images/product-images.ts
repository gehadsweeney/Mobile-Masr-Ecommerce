import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../../Services/upload-service';

@Component({
  selector: 'app-product-images',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-images.html',
  styleUrl: './product-images.scss',
})
export class ProductImages {
  @Input() group!: FormGroup;
  uploading = false;

  constructor(private uploadService: UploadService, private fb: FormBuilder) {}

  get imagesArray(): string[] {
    return this.group.get('images')?.value || [];
  }

  onFilesSelected(event: any) {
    const files: File[] = Array.from(event.target.files);
    if (!files.length) return;

    this.uploading = true;
    let uploadedCount = 0;
    const currentImages = [...this.imagesArray];

    files.forEach((file) => {
      this.uploadService.uploadImage(file).subscribe({
        next: (res) => {
          currentImages.push(res.secure_url);
          this.group.get('images')?.setValue(currentImages);
          uploadedCount++;

          if (uploadedCount === files.length) {
            this.uploading = false;
          }
        },
        error: (err) => {
          console.error('Upload error:', err);
          uploadedCount++;

          if (uploadedCount === files.length) {
            this.uploading = false;
          }
        },
      });
    });

    // Clear input
    event.target.value = '';
  }

  removeImage(index: number) {
    const currentImages = [...this.imagesArray];
    currentImages.splice(index, 1);
    this.group.get('images')?.setValue(currentImages);
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }
}
