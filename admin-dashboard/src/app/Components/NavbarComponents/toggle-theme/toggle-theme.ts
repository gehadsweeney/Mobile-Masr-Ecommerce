import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle-theme',
  imports: [],
  templateUrl: './toggle-theme.html',
  styleUrl: './toggle-theme.scss',
})
export class ToggleTheme {
  isDarkTheme = localStorage.getItem('theme') === 'dark';

  constructor() {
    if (this.isDarkTheme) {
      document.body.classList.add('dark');
    }
  }

  toggleTheme() {
    document.body.classList.toggle('dark');
    this.isDarkTheme = !this.isDarkTheme;
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
