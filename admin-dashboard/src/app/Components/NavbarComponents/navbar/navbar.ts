import { Component } from '@angular/core';
import { SearchBox } from '../search-box/search-box';
import { AdminProfile } from '../admin-profile/admin-profile';
import { ToggleTheme } from '../toggle-theme/toggle-theme';

@Component({
  selector: 'app-navbar',
  imports: [SearchBox, AdminProfile, ToggleTheme],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {}
