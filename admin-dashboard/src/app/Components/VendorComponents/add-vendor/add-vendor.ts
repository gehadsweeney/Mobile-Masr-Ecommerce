import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../Services/upload-service';
import { VendorServices } from '../../../Services/vendor-services';
import { Ivendor } from '../../../Models/ivendor';

@Component({
  selector: 'app-add-vendor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-vendor.html',
  styleUrls: ['./add-vendor.scss'],
})
export class AddVendor implements OnInit {
  form: FormGroup;
  uploading = false;
  submitting = false;
  imageUrl = '';
  imagePreview: string | null = null;
  editing = false;
  vendorId: string | null = null;
  originalVendor: Ivendor | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private vendorService: VendorServices,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^01[0-2,5]{1}[0-9]{8}$/)],
      ],
      address: ['', [Validators.required, Validators.minLength(3)]],
      rating: [5, [Validators.required, Validators.min(0), Validators.max(5)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.vendorId = id;
      this.loadVendor(id);
    }
  }

  loadVendor(id: string) {
    this.vendorService.getVendorById(id).subscribe({
      next: (vendor) => {
        this.originalVendor = vendor;
        this.form.patchValue({
          name: vendor.name,
          phone: vendor.phone || '',
          address: vendor.address || '',
          rating: vendor.rating ?? 5,
        });
        this.imageUrl = vendor.image;
        this.imagePreview = vendor.image;
      },
      error: () => {
        this.toastr.error('Failed to load vendor');
        this.router.navigate(['/admin/vendors']);
      },
    });
  }

  onImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.uploading = true;
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.imageUrl = res.secure_url;
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
    this.imageUrl = '';
    this.imagePreview = null;
  }

  hasChanges(): boolean {
    if (!this.originalVendor) return true;
    return (
      this.form.value.name !== this.originalVendor.name ||
      (this.form.value.phone || '') !== (this.originalVendor.phone || '') ||
      (this.form.value.address || '') !== (this.originalVendor.address || '') ||
      (this.form.value.rating ?? 0) !== (this.originalVendor.rating ?? 0) ||
      this.imageUrl !== this.originalVendor.image
    );
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid || !this.imageUrl) {
      this.form.markAllAsTouched();
      this.toastr.error('Please fill all required fields');
      return;
    }

    if (this.editing && !this.hasChanges()) {
      this.toastr.info('No changes to save');
      return;
    }

    this.submitting = true;

    const payload: Ivendor = {
      name: this.form.value.name,
      phone: this.form.value.phone,
      address: this.form.value.address,
      image: this.imageUrl,
      rating: Number(this.form.value.rating ?? 0),
    };

    const request = this.editing && this.vendorId
      ? this.vendorService.updateVendor(this.vendorId, payload)
      : this.vendorService.addVendor(payload);

    request.subscribe({
      next: () => {
        this.toastr.success(this.editing ? 'Vendor updated successfully' : 'Vendor added successfully');
        this.submitting = false;
        this.form.reset({ rating: 0 });
        this.imageUrl = '';
        this.imagePreview = null;
        this.submitted = false;
        this.router.navigate(['/admin/vendors']);
      },
      error: (err) => {
        console.error('Error saving vendor', err);
        this.toastr.error('Failed to save vendor');
        this.submitting = false;
      },
    });
  }
}
