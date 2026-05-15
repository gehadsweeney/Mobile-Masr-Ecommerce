import { Component, OnInit } from '@angular/core';
import { ProductServices } from '../../../Services/product-services';
import { Iproduct } from '../../../Models/iproduct';
import { Loader } from '../../loader/loader';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.html',
  styleUrls: ['./products.scss'],
  imports: [Loader],
})
export class Products implements OnInit {
  products: Iproduct[] = [];
  isLoading = false;

  page: number = 1;
  totalPages: number = 1;
  totalProducts: number = 0;
  search: string = '';

  Math: Math = Math;

  deletePopupVisible = false;
  deleteId: string | null = null;

  constructor(
    private productService: ProductServices,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // ✅ اسمع لأي تغيير في query params
    this.route.queryParams.subscribe((params) => {
      this.page = +params['page'] || 1;
      this.search = params['search'] || '';

      this.fetchProducts();
    });
  }

  fetchProducts() {
    this.isLoading = true;

    this.productService.getAllProducts(this.page, this.search).subscribe({
      next: (res) => {
        this.products = res.data as Iproduct[];
        this.totalPages = res.totalPages || 1;
        this.totalProducts = res.totalProducts || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
  // 🔹 NEW: هل في Search ولا لأ
  get hasSearch(): boolean {
    return !!this.search;
  }

  // 🔹 NEW: مسح السيرش
  clearSearch() {
    this.router.navigate([], {
      queryParams: { search: null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  // ================= Pagination =================
  handlePage(action: 'first' | 'prev' | 'next' | 'last') {
    let newPage = this.page;

    if (action === 'first') newPage = 1;
    else if (action === 'prev' && this.page > 1) newPage--;
    else if (action === 'next' && this.page < this.totalPages) newPage++;
    else if (action === 'last') newPage = this.totalPages;

    this.router.navigate([], {
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
    });
  }

  // ================= Actions =================
  showProduct(product: Iproduct) {
    this.router.navigate(['/admin/products/details', product._id]);
  }

  editProduct(product: Iproduct) {
    this.router.navigate(['/admin/products/edit', product._id]);
  }

  showDeletePopup(productId: string) {
    this.deleteId = productId;
    this.deletePopupVisible = true;
  }

  confirmDelete() {
    if (!this.deleteId) return;

    this.productService.deleteProduct(this.deleteId).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p._id !== this.deleteId);
        this.deletePopupVisible = false;
        this.deleteId = null;
        this.toastr.success('Product deleted successfully', 'Success');
      },
      error: () => {
        this.toastr.error('Error deleting product', 'Error');
      },
    });
  }
}
