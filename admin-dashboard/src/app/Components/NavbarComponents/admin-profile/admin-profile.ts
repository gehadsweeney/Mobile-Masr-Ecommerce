import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../Services/auth';
import { Iuser } from '../../../Models/iuser';

@Component({
  selector: 'app-admin-profile',
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-profile.html',
  styleUrl: './admin-profile.scss',
})
export class AdminProfile {
  open = signal(false);
  user = signal<Iuser | null>(null);
  picture = computed(() => this.user()?.profilePicture || '');
  name = computed(() => {
    const full = this.user()?.name || 'Admin';
    const parts = full.trim().split(/\s+/);
    return parts.slice(0, 2).join(' ');
  });

  initials = computed(() => {
    const n = this.name();
    return n
      .split(' ')
      .map((p) => p.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  });

  email = computed(() => this.user()?.email || '');

  constructor(private auth: Auth, private router: Router) {
    try {
      this.auth.fetchMe().subscribe({
        next: (res) => this.user.set(res.user),
        error: () => this.user.set(null),
      });
    } catch {
      this.user.set(null);
    }
  }

}
