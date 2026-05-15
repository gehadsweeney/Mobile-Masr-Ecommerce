import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.scss',
})
export class SearchBox {
  searchValue: string = '';

  // الروتات المسموح فيها بالبحث
  allowedRoutes = [
    '/admin/products',
    '/admin/users',
    '/admin/orders',
    '/admin/vendors',
    '/admin/categories',
    '/admin/brands',
  ];

  constructor(private router: Router, private route: ActivatedRoute) {}

  get showSearchBox(): boolean {
    // يتحقق إذا كان الروت الحالي يبدأ بأي من الروتات المسموحة
    return this.allowedRoutes.some((route) => this.router.url.startsWith(route));
  }

  onSearch() {
    const value = this.searchValue.trim();

    // const isProductsRoute = this.router.url.startsWith('/admin/products');
    const isProductsOrUsersRoute =
      this.router.url.startsWith('/admin/products') || this.router.url.startsWith('/admin/users');

    // ✅ لو فاضي: اعمل ولا حاجة
    if (!value) {
      this.router.navigate([], {
        queryParams: isProductsOrUsersRoute ? { search: null, page: 1 } : { search: null },
        queryParamsHandling: 'merge',
      });
      return;
    }

    // ✅ ناخد ال query params الحالية (page مثلا)
    const currentQueryParams = {
      ...this.route.snapshot.queryParams,
      search: value,
    };

    // تحقق من الروت الحالي

    // ✅ نعمل navigate على نفس الروت
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: isProductsOrUsersRoute ? { ...currentQueryParams, page: 1 } : currentQueryParams,
      queryParamsHandling: 'merge',
    });
  }
}
