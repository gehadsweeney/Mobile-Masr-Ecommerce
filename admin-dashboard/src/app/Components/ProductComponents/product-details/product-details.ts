import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductServices } from '../../../Services/product-services';
import { Iproduct } from '../../../Models/iproduct';
import { Loader } from '../../loader/loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.scss'],
  imports: [Loader],
})
export class ProductDetails implements OnInit {
  product?: Iproduct;
  isLoading = true;

  stockDraft: number = 0;
  stockSuccessMsg = '';

  // ================= Popup State =================
  popupVisible = false;
  popupType: 'delete' | 'updateStock' | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductServices,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(id).subscribe({
        next: (res) => {
          this.product = res.data as Iproduct;
          this.stockDraft = this.product.stock ?? 0;
          this.isLoading = false;
        },
        error: () => (this.isLoading = false),
      });
    } else {
      this.isLoading = false;
    }
  }

  // ================= Stock =================
  updateStock(change: number) {
    if (this.stockDraft + change < 0) return;
    this.stockDraft += change;
  }

  saveStock() {
    if (!this.product) return;

    this.productService
      .updateProduct(this.product._id!, {
        ...this.product,
        stock: this.stockDraft,
      })
      .subscribe({
        next: (res) => {
          this.product = res.data as Iproduct;
          this.toastr.success('Stock updated successfully!', 'Success');
        },
        error: () => {
          this.toastr.error('Error updating stock!', 'Error');
        },
      });
  }

  // ================= Popup Control =================
  openPopup(type: 'delete' | 'updateStock') {
    this.popupType = type;
    this.popupVisible = true;
  }

  closePopup() {
    this.popupVisible = false;
    this.popupType = null;
  }

  confirmPopup() {
    if (this.popupType === 'delete') {
      this.confirmDelete();
    }

    if (this.popupType === 'updateStock') {
      this.saveStock();
    }

    this.closePopup();
  }

  // ================= Actions =================
  goToEdit(prodId: string) {
    this.router.navigate(['/admin/products/edit', prodId]);
  }

  confirmDelete() {
    if (!this.product) return;

    this.productService.deleteProduct(this.product._id!).subscribe({
      next: () => {
        this.toastr.success('Product deleted successfully!', 'Success');
        this.router.navigate(['/admin/products']);
      },
      error: () => {
        this.toastr.error('Error deleting product!', 'Error');
      },
    });
  }
}
