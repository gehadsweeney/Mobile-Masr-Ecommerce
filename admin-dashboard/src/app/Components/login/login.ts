import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../../Services/auth';
import { Router } from '@angular/router';
import { LoginResponse } from '../../Models/login-response';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  submit() {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res: LoginResponse) => {
        if (res.user.role !== 'admin') {
          this.toastr.error('You are not authorized to access dashboard', 'Access Denied');
          return;
        }
        this.authService.saveUser(res);
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.toastr.error('Invalid email or password', 'Login Failed');
      },
    });
  }
}
