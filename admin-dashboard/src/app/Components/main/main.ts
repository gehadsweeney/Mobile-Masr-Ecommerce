import { Component, Input } from '@angular/core';
import { Navbar } from '../NavbarComponents/navbar/navbar';
import { RouterOutlet } from '@angular/router';
// import { RouterOutlet } from "../../../../node_modules/@angular/router/router_module.d";

@Component({
  selector: 'app-main',
  imports: [Navbar, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  @Input() isCollapsed = false;
}
