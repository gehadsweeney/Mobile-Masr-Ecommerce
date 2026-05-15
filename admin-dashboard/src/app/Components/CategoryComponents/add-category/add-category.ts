import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryServices } from '../../../Services/category-services';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../Services/upload-service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-category.html',
  styleUrls: ['./add-category.scss']
})
export class AddCategory {
  form: FormGroup;
  loading = false;
  uploading = false;
  categoryImage = '';
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryServices,
    private router: Router,
    private toastr: ToastrService,
    private uploadService: UploadService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.uploading = true;

    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.categoryImage = res.secure_url;
        this.uploading = false;
        this.toastr.success('Image uploaded');
      },
      error: () => {
        this.uploading = false;
        this.toastr.error('Upload failed');
      },
    });

    input.value = '';
  }

  removeImage() {
    this.categoryImage = '';
    this.imagePreview = null;
  }

  submit() {
    if (this.form.invalid || !this.categoryImage) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    this.loading = true;

    const payload = {
      name: this.form.value.name,
      image: this.categoryImage
    };

    this.categoryService.addCategory(payload).subscribe({
      next: () => {
        this.toastr.success('Category added successfully!');
        this.form.reset();
        this.categoryImage = '';
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastr.error('Failed to add category');
        this.loading = false;
      }
    });
  }
}
