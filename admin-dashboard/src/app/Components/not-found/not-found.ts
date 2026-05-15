import { Component } from '@angular/core';
import { Location } from '@angular/common';
@Component({
  selector: 'app-not-found',
  imports: [],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFound {
  bubbles = Array(5);

  constructor(private location: Location) {}

  goBack() {
    this.location.back();
  }
}
