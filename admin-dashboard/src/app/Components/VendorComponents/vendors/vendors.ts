import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServices } from '../../../Services/vendor-services';
import { Ivendor } from '../../../Models/ivendor';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendors.html',
  styleUrls: ['./vendors.scss'],
})
export class Vendors implements OnInit {
  vendors: Ivendor[] = [];
  allVendors: Ivendor[] = [];
  isLoading = false;
  errorMsg = '';
  search: string = '';

  // Delete confirm popup
  showDeleteConfirm = false;
  deleteTargetId: string | null = null;
  deleteTargetName = '';

  constructor(
    private vendorService: VendorServices,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || '';
      this.fetchVendors();
    });
  }

  fetchVendors() {
    this.isLoading = true;
    this.vendorService.getAllVendors().subscribe({
      next: (res) => {
        this.allVendors = res;
        this.filterVendors();
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Error while loading vendors';
        this.isLoading = false;
      },
    });
  }

  filterVendors() {
    if (!this.search) {
      this.vendors = this.allVendors;
      return;
    }

    const searchLower = this.search.toLowerCase();
    this.vendors = this.allVendors.filter(
      (vendor) =>
        vendor.name?.toLowerCase().includes(searchLower) ||
        vendor.phone?.toLowerCase().includes(searchLower) ||
        vendor.address?.toLowerCase().includes(searchLower)
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

  editVendor(id: string) {
    this.router.navigate(['/admin/vendors/edit', id]);
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

    this.vendorService.deleteVendor(this.deleteTargetId).subscribe({
      next: () => {
        this.vendors = this.vendors.filter((v) => v._id !== this.deleteTargetId);
        this.closeDeleteConfirm();
      },
      error: (err) => {
        console.error('Error deleting vendor:', err);
        this.closeDeleteConfirm();
      },
    });
  }
}
