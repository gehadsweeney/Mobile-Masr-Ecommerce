import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface CategoryField {
  name: string;
  type: string;
  required: boolean;
}

interface Category {
  name: string;
  fields: CategoryField[];
}

@Component({
  selector: 'app-category-fields-guide',
  imports: [CommonModule],
  templateUrl: './category-fields-guide.html',
  styleUrl: './category-fields-guide.scss',
})
export class CategoryFieldsGuide {
  @Output() close = new EventEmitter<void>();

  categories: Category[] = [
    {
      name: 'Mobile Phone',
      fields: [
        { name: 'Name (en/ar)', type: 'Text', required: true },
        { name: 'Price', type: 'Number', required: true },
        { name: 'SKU Code', type: 'Text', required: true },
        { name: 'Description (en/ar)', type: 'Textarea', required: true },
        { name: 'Condition (en/ar)', type: 'Select', required: true },
        { name: 'Storage', type: 'Select', required: true },
        { name: 'RAM', type: 'Checkbox Array', required: true },
        { name: 'Color', type: 'Select', required: true },
        { name: 'Battery Capacity', type: 'Text', required: true },
        { name: 'SIM Card', type: 'Select', required: true },
        { name: 'Screen Size', type: 'Text', required: true },
        { name: 'Camera', type: 'Text', required: true },
        { name: 'Weight', type: 'Text', required: true },
        { name: 'Accessories (en/ar)', type: 'Checkbox Array', required: false },
        { name: 'Battery Status (en/ar)', type: 'Text', required: false },
        { name: 'Guarantee (en/ar)', type: 'Text', required: false },
        { name: 'Images', type: 'File Upload', required: true },
        { name: 'Category', type: 'Select', required: true },
        { name: 'Brand', type: 'Select', required: true },
        { name: 'Vendor', type: 'Select', required: false },
        { name: 'Stock', type: 'Number', required: false },
        { name: 'Discount (%)', type: 'Number', required: false },
      ],
    },
    {
      name: 'Tablet',
      fields: [
        { name: 'Name (en/ar)', type: 'Text', required: true },
        { name: 'Price', type: 'Number', required: true },
        { name: 'SKU Code', type: 'Text', required: true },
        { name: 'Description (en/ar)', type: 'Textarea', required: true },
        { name: 'Condition (en/ar)', type: 'Select', required: true },
        { name: 'Storage', type: 'Select', required: true },
        { name: 'RAM', type: 'Checkbox Array', required: true },
        { name: 'Color', type: 'Select', required: true },
        { name: 'Battery Capacity', type: 'Text', required: true },
        { name: 'SIM Card', type: 'Select', required: true },
        { name: 'Screen Size', type: 'Text', required: true },
        { name: 'Camera', type: 'Text', required: true },
        { name: 'Weight', type: 'Text', required: true },
        { name: 'Accessories (en/ar)', type: 'Checkbox Array', required: false },
        { name: 'Guarantee (en/ar)', type: 'Text', required: false },
        { name: 'Images', type: 'File Upload', required: true },
        { name: 'Category', type: 'Select', required: true },
        { name: 'Brand', type: 'Select', required: true },
        { name: 'Vendor', type: 'Select', required: false },
        { name: 'Stock', type: 'Number', required: false },
        { name: 'Discount (%)', type: 'Number', required: false },
      ],
    },
    {
      name: 'Smart Watches',
      fields: [
        { name: 'Name (en/ar)', type: 'Text', required: true },
        { name: 'Price', type: 'Number', required: true },
        { name: 'SKU Code', type: 'Text', required: true },
        { name: 'Description (en/ar)', type: 'Textarea', required: true },
        { name: 'Condition (en/ar)', type: 'Select', required: true },
        { name: 'Color', type: 'Select', required: true },
        { name: 'Accessories (en/ar)', type: 'Checkbox Array', required: false },
        { name: 'Guarantee (en/ar)', type: 'Text', required: false },
        { name: 'Images', type: 'File Upload', required: true },
        { name: 'Category', type: 'Select', required: true },
        { name: 'Brand', type: 'Select', required: true },
        { name: 'Vendor', type: 'Select', required: false },
        { name: 'Stock', type: 'Number', required: false },
        { name: 'Discount (%)', type: 'Number', required: false },
      ],
    },
    {
      name: 'Wireless Earbuds',
      fields: [
        { name: 'Name (en/ar)', type: 'Text', required: true },
        { name: 'Price', type: 'Number', required: true },
        { name: 'SKU Code', type: 'Text', required: true },
        { name: 'Description (en/ar)', type: 'Textarea', required: true },
        { name: 'Condition (en/ar)', type: 'Select', required: true },
        { name: 'Color', type: 'Select', required: true },
        { name: 'Accessories (en/ar)', type: 'Checkbox Array', required: false },
        { name: 'Guarantee (en/ar)', type: 'Text', required: false },
        { name: 'Images', type: 'File Upload', required: true },
        { name: 'Category', type: 'Select', required: true },
        { name: 'Brand', type: 'Select', required: true },
        { name: 'Vendor', type: 'Select', required: false },
        { name: 'Stock', type: 'Number', required: false },
        { name: 'Discount (%)', type: 'Number', required: false },
      ],
    },
    {
      name: 'Game Consoles',
      fields: [
        { name: 'Name (en/ar)', type: 'Text', required: true },
        { name: 'Price', type: 'Number', required: true },
        { name: 'SKU Code', type: 'Text', required: true },
        { name: 'Description (en/ar)', type: 'Textarea', required: true },
        { name: 'Condition (en/ar)', type: 'Select', required: true },
        { name: 'Color', type: 'Select', required: true },
        { name: 'Accessories (en/ar)', type: 'Checkbox Array', required: false },
        { name: 'Guarantee (en/ar)', type: 'Text', required: false },
        { name: 'Images', type: 'File Upload', required: true },
        { name: 'Category', type: 'Select', required: true },
        { name: 'Brand', type: 'Select', required: true },
        { name: 'Vendor', type: 'Select', required: false },
        { name: 'Stock', type: 'Number', required: false },
        { name: 'Discount (%)', type: 'Number', required: false },
      ],
    },
    {
      name: 'Laptop',
      fields: [
        { name: 'Name (en/ar)', type: 'Text', required: true },
        { name: 'Price', type: 'Number', required: true },
        { name: 'SKU Code', type: 'Text', required: true },
        { name: 'Description (en/ar)', type: 'Textarea', required: true },
        { name: 'Condition (en/ar)', type: 'Select', required: true },
        { name: 'RAM', type: 'Checkbox Array', required: true },
        { name: 'Color', type: 'Select', required: true },
        { name: 'Screen Size', type: 'Text', required: true },
        { name: 'Processor', type: 'Text', required: false },
        { name: 'GPU', type: 'Text', required: false },
        { name: 'HDD', type: 'Select', required: false },
        { name: 'SSD', type: 'Select', required: false },
        { name: 'Accessories (en/ar)', type: 'Checkbox Array', required: false },
        { name: 'Guarantee (en/ar)', type: 'Text', required: false },
        { name: 'Images', type: 'File Upload', required: true },
        { name: 'Category', type: 'Select', required: true },
        { name: 'Brand', type: 'Select', required: true },
        { name: 'Vendor', type: 'Select', required: false },
        { name: 'Stock', type: 'Number', required: false },
        { name: 'Discount (%)', type: 'Number', required: false },
      ],
    },
  ];

  onClose(): void {
    this.close.emit();
  }
}
