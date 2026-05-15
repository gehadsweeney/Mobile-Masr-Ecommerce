import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoryServices } from '../../../../Services/category-services';
import { BrandServices } from '../../../../Services/brand-services';
import { VendorServices } from '../../../../Services/vendor-services';
import { Icategory } from '../../../../Models/icategory';
import { Ibrand } from '../../../../Models/ibrand';
import { Ivendor } from '../../../../Models/ivendor';

@Component({
  selector: 'app-general-info',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './general-info.html',
  styleUrl: './general-info.scss',
})
export class GeneralInfo implements OnInit {
  @Input() group!: FormGroup;

  categories: Icategory[] = [];
  brands: Ibrand[] = [];
  vendors: Ivendor[] = [];

  colors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#FF0000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Blue', value: '#0000FF' },
    { name: 'Grey', value: '#808080' },
    { name: 'Mystic Black', value: '#1C1C1C' },
    { name: 'Crystal Black', value: '#0D0D0D' },
    { name: 'Orange', value: '#FFA500' },
    { name: 'Silver', value: '#C0C0C0' },
    { name: 'Gold', value: '#FFD700' },
    { name: 'Yellow', value: '#FFFF00' },
    { name: 'Brown', value: '#A52A2A' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'Purple', value: '#800080' },
    { name: 'Cream', value: '#FFFDD0' },
    { name: 'Dark Gray', value: '#4A4A4A' },
    { name: 'Midnight Black', value: '#0A0A0A' },
    { name: 'Titanium Silver', value: '#B8B8B8' },
    { name: 'Starry Black', value: '#131313' },
    { name: 'Mint Green', value: '#98FF98' },
    { name: 'Sunrise Gold', value: '#FFB347' },
    { name: 'Carbon Black', value: '#1A1A1A' },
    { name: 'Flowing Silver', value: '#D3D3D3' },
    { name: 'Sea Blue', value: '#006994' },
    { name: 'Graphite', value: '#3C3C3C' },
    { name: 'Space Black', value: '#050505' },
    { name: 'Navy', value: '#000080' },
    { name: 'Lavender', value: '#E6E6FA' },
    { name: 'Titanium', value: '#878681' },
    { name: 'Misty Pink', value: '#FFD1DC' },
    { name: 'Ice Blue', value: '#B0E0E6' },
    { name: 'Navy Blue', value: '#000080' },
    { name: 'Sky Silver', value: '#C9DAEA' },
    { name: 'Ocean Blue', value: '#4682B4' },
    { name: 'Light Green', value: '#90EE90' },
    { name: 'Moonlight White', value: '#F8F8FF' },
    { name: 'Titanium Violet', value: '#926AA6' },
    { name: 'Titanium Gray', value: '#8A8A8A' },
    { name: 'Titanium Blue', value: '#6A7F99' },
    { name: 'Titanium Black', value: '#282828' },
    { name: 'Cobalt Violet', value: '#7B2D8F' },
    { name: 'Amber Yellow', value: '#FFBF00' },
    { name: 'Natural Titanium', value: '#9B9B8F' },
    { name: 'White Titanium', value: '#E8E8E8' },
    { name: 'Starlight', value: '#F5F5DC' },
    { name: 'Sierra Blue', value: '#69ABD3' },
    { name: 'Space Gray', value: '#565656' },
    { name: 'Iron Gray', value: '#52595D' },
    { name: 'Midnight', value: '#191970' },
    { name: 'Cyclone Black', value: '#1C1C1C' },
    { name: 'Waving Aqua', value: '#00CED1' },
    { name: 'Voyager Black', value: '#0F0F0F' },
    { name: 'Razor Green', value: '#00FF00' },
    { name: 'Silver Shadow', value: '#B0B0B0' },
    { name: 'Mint', value: '#3EB489' },
    { name: 'Charcoal', value: '#36454F' },
    { name: 'Stainless Steel', value: '#B2BEB5' },
    { name: 'Isle Blue', value: '#4169E1' },
    { name: 'Dark Green', value: '#013220' },
    { name: 'Lavender Purple', value: '#967BB6' },
    { name: 'Desert Gold', value: '#D4AF37' },
    { name: 'Sandy Gold', value: '#E6C88F' },
    { name: 'Ultramarine', value: '#4166F5' },
    { name: 'Desert Titanium', value: '#B8997D' },
    { name: 'Silver Frost', value: '#D4D4D4' },
    { name: 'Ocean Cyan', value: '#00B5B8' },
    { name: 'Jet Black', value: '#0A0A0A' },
    { name: 'Monet Gold', value: '#CFAC7D' },
    { name: 'Deep Purple', value: '#673AB7' },
    { name: 'Icy Blue', value: '#99CCFF' },
    { name: 'Midnight Green', value: '#004953' },
    { name: 'Luminous Blue', value: '#6FB3D2' },
    { name: 'Skyline Blue', value: '#87CEEB' },
    { name: 'Pearl White', value: '#F3F3F3' },
    { name: 'Plume White', value: '#FAFAFA' },
    { name: 'Awesome Navy', value: '#003366' },
    { name: 'Awesome White', value: '#F8F8F8' },
    { name: 'Suede Gray', value: '#8B8680' },
    { name: 'Suede Grey', value: '#8B8680' },
    { name: 'Awesome Light Gray', value: '#D3D3D3' },
    { name: 'Meteor Silver', value: '#B4B4B4' },
    { name: 'Luna Grey', value: '#7A7A7A' },
    { name: 'Sky Blue', value: '#87CEEB' },
    { name: 'Mercurial Silver', value: '#BFBFBF' },
    { name: 'Cosmic Orange', value: '#FF6347' },
    { name: 'Luminous Green', value: '#32CD32' },
    { name: 'Pantone Amazonite', value: '#93C5B5' },
    { name: 'Pantone Slipstream', value: '#C5E1E6' },
    { name: 'Phantom Black', value: '#0C0C0C' },
    { name: 'Phantom Green', value: '#264E36' },
    { name: 'Phantom Silver', value: '#8C9097' },
    { name: 'Violet', value: '#8F00FF' },
    { name: 'Light Violet', value: '#CF9FFF' },
    { name: 'Green', value: '#008000' },
    { name: 'Metallic Blue', value: '#4682B4' },
    { name: 'Mystic Bronze', value: '#CD7F32' },
  ];

  constructor(
    private categoryService: CategoryServices,
    private brandService: BrandServices,
    private vendorService: VendorServices
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBrands();
    this.loadVendors();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      },
    });
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Error loading brands:', err);
      },
    });
  }

  loadVendors(): void {
    this.vendorService.getAllVendors().subscribe({
      next: (data) => {
        this.vendors = data;

        // Set default vendor to "Mobile Masr" if no vendor is selected
        const currentVendorValue = this.group.get('vendor')?.value;
        if (!currentVendorValue) {
          const defaultVendor = data.find((v) => v.name === 'Mobile Masr');
          if (defaultVendor) {
            this.group.get('vendor')?.setValue(defaultVendor._id, { emitEvent: false });
          }
        }
      },
      error: (err) => {
        console.error('Error loading vendors:', err);
      },
    });
  }

  onConditionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const value = selectElement.value;

    const conditionGroup = this.group.get('condition');
    if (conditionGroup) {
      conditionGroup.patchValue({
        en: value,
        ar: value === 'new' ? 'جديد' : 'مستعمل',
      });
    }
  }
}
