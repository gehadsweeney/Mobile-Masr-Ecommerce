import { Component, OnInit } from '@angular/core';
import { BrandServices } from '../../../Services/brand-services';
import { Ibrand } from '../../../Models/ibrand';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.html',
  styleUrls: ['./brands.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class Brands implements OnInit {
  brands: Ibrand[] = [];
  allBrands: Ibrand[] = [];
  isLoading = false;
  errorMsg = '';
  search: string = '';

  // Delete confirm popup variables
  showDeleteConfirm = false;
  deleteTargetId: string | null = null;
  deleteTargetName = '';

  constructor(
    private brandService: BrandServices,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || '';
      this.getAllBrands();
    });
  }

  getAllBrands() {
    this.isLoading = true;
    this.brandService.getAllBrands().subscribe({
      next: (res) => {
        this.allBrands = res;
        this.filterBrands();
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Error while loading brands';
        this.isLoading = false;
      },
    });
  }

  filterBrands() {
    if (!this.search) {
      this.brands = this.allBrands;
      return;
    }

    const searchLower = this.search.toLowerCase();
    this.brands = this.allBrands.filter(
      (brand) =>
        brand.name?.toLowerCase().includes(searchLower)
    );
  }

  get hasSearch(): boolean {
    return !!this.search;
  }

  clearSearch() {
    this.router.navigate([], {
      queryParams: { search: null },
      queryParamsHandling: 'merge',
    });
  }

  editBrand(id: string) {
    this.router.navigate(['/admin/brands/edit', id]);
  }

  openDeleteConfirm(id: string, name: string) {
    this.deleteTargetId = id;
    this.deleteTargetName = name;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.deleteTargetId = null;
    this.deleteTargetName = '';
  }

  confirmDelete() {
    if (!this.deleteTargetId) return;

    this.brandService.deleteBrand(this.deleteTargetId).subscribe({
      next: () => {
        this.brands = this.brands.filter((b) => b._id !== this.deleteTargetId);
        this.closeDeleteConfirm();
      },
      error: (err) => {
        console.error('Error deleting brand:', err);
        this.closeDeleteConfirm();
      },
    });
  }
}
