import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandServices } from '../../../Services/brand-services';
import { Ibrand } from '../../../Models/ibrand';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UploadService } from '../../../Services/upload-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-brand',
  standalone: true,
  templateUrl: './add-brand.html',
  styleUrls: ['./add-brand.scss'],
  imports: [CommonModule, FormsModule],
})
export class AddBrand implements OnInit {
  formBrand: Ibrand = { name: '', image: '' };
  originalBrand!: Ibrand;
  editing = false;
  uploading = false;
  brandId!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private brandService: BrandServices,
    private uploadService: UploadService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.brandId = id;
      this.editing = true;
      this.getBrandById(id);
    }
  }

  getBrandById(id: string) {
    this.brandService.getBrandById(id).subscribe({
      next: (brand) => {
        this.formBrand = {
          _id: brand._id || (brand as any).id,
          name: brand.name,
          image: brand.image,
        };
        this.originalBrand = { ...this.formBrand };
      },
      error: () => {
        this.toastr.error('Failed to load brand');
        this.router.navigate(['/brands']);
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.uploading = true;

    this.uploadService.uploadImage(input.files[0]).subscribe({
      next: (res) => {
        this.formBrand.image = res.secure_url;
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
    this.formBrand.image = '';
  }

  hasChanges(): boolean {
    return (
      this.formBrand.name !== this.originalBrand?.name ||
      this.formBrand.image !== this.originalBrand?.image
    );
  }

  submitForm(form: NgForm) {
    if (!form.valid || !this.formBrand.image) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    const request = this.editing
      ? this.brandService.updateBrand(this.brandId, this.formBrand)
      : this.brandService.addBrand(this.formBrand);
    request.subscribe({
      next: () => {
        this.toastr.success(
          this.editing ? 'Brand updated successfully' : 'Brand added successfully'
        );

        this.router.navigate(['/admin/brands']);
      },
      error: () => this.toastr.error('Something went wrong'),
    });
  }
}
