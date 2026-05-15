import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing-and-inventory',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './pricing-and-inventory.html',
  styleUrl: './pricing-and-inventory.scss',
})
export class PricingAndInventory {
  @Input() group!: FormGroup;

  generateSKU(): void {
    const randomSKU = 'PROD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    this.group.get('skuCode')?.setValue(randomSKU);
  }
}
