import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminSettingsService } from '../../Services/admin-settings.service';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-settings.html',
  styleUrls: ['./admin-settings.scss'],
})
export class AdminSettings implements OnInit {
  profileForm: FormGroup;
  passwordForm: FormGroup;

  loadingProfile = false;
  savingProfile = false;
  uploading = false;
  changingPassword = false;

  avatarPreview: string | null = null;
  selectedFile: File | null = null;
  defaultAvatar = 'https://ui-avatars.com/api/?name=Admin&background=fe5100&color=fff';

  constructor(
    private fb: FormBuilder,
    private adminSettings: AdminSettingsService,
    private toastr: ToastrService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^01[0-9]{9}$/)]],
      address: [''],
    });

    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator() }
    );
  }

  ngOnInit(): void {
    this.fetchProfile();
  }

  get pf() {
    return this.profileForm.controls;
  }

  get pwf() {
    return this.passwordForm.controls;
  }

  get isDarkMode(): boolean {
    return typeof document !== 'undefined' && document.body.classList.contains('dark');
  }

  passwordsMatchValidator(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const newPass = group.get('newPassword')?.value;
      const confirm = group.get('confirmPassword')?.value;
      return newPass && confirm && newPass !== confirm ? { passwordMismatch: true } : null;
    };
  }

  fetchProfile() {
    this.loadingProfile = true;
    this.adminSettings.getMyProfile().subscribe({
      next: ({ user }) => {
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
        });
        this.avatarPreview = user.profilePicture || null;
        this.loadingProfile = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Failed to load profile');
        this.loadingProfile = false;
      },
    });
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files.length) return;
    const file = input.files[0];

    if (!file.type.startsWith('image/')) {
      this.toastr.error('Images only are allowed');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.toastr.error('Max image size is 5MB');
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  uploadAvatar() {
    if (!this.selectedFile) {
      this.toastr.info('Please select an image first');
      return;
    }

    this.uploading = true;
    this.adminSettings.uploadProfilePicture(this.selectedFile).subscribe({
      next: (res) => {
        const img = res?.user?.profilePicture || this.avatarPreview;
        this.avatarPreview = img;
        this.toastr.success('Profile picture updated');
        this.selectedFile = null;
        this.uploading = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'Image upload failed');
        this.uploading = false;
      },
    });
  }

  submitProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savingProfile = true;
    const payload = this.profileForm.value;
    this.adminSettings.updateMyProfile(payload).subscribe({
      next: () => {
        this.toastr.success('Profile saved');
        this.savingProfile = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'An error occurred while saving');
        this.savingProfile = false;
      },
    });
  }

  submitPassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { oldPassword, newPassword } = this.passwordForm.value;
    this.changingPassword = true;
    this.adminSettings.changePassword(oldPassword, newPassword).subscribe({
      next: () => {
        this.toastr.success('Password updated');
        this.passwordForm.reset();
        this.changingPassword = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error(err?.error?.message || 'Password change failed');
        this.changingPassword = false;
      },
    });
  }
}
