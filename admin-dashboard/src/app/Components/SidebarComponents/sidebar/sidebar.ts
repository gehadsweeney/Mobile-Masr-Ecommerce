import { Component, EventEmitter, Output } from '@angular/core';
import { Logo } from '../logo/logo';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../Services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [Logo, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Output() toggleEvent = new EventEmitter<boolean>();
  isCollapsed = false;
  constructor(private authService: Auth , private router: Router){}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleEvent.emit(this.isCollapsed);
  }
}
