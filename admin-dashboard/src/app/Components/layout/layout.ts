import { Component } from '@angular/core';
import { Sidebar } from '../SidebarComponents/sidebar/sidebar';
import { Main } from '../main/main';

@Component({
  selector: 'app-layout',
  imports: [Sidebar, Main],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {
  sidebarCollapsed = false;

  onToggleSidebar(collapsed: boolean) {
    this.sidebarCollapsed = collapsed;
  }
}
