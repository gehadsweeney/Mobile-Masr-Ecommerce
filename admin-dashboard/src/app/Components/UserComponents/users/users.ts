import { Component, OnInit } from '@angular/core';
import { UserServices } from '../../../Services/user-services';
import { Iuser } from '../../../Models/iuser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Loader } from '../../loader/loader';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrl: './users.scss',
  imports: [Loader, CommonModule],
})
export class Users implements OnInit {
  users: Iuser[] = [];
  isLoading = false;

  page: number = 1;
  totalPages: number = 1;
  totalUsers: number = 0;
  search: string = '';

  deletePopupVisible = false;
  deleteId: string | null = null;
  Math: Math = Math;

  constructor(
    private userService: UserServices,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.page = +params['page'] || 1;
      this.search = params['search'] || '';
      this.fetchUsers();
    });
  }

  fetchUsers() {
    this.isLoading = true;
    this.userService.getAllUsers(this.page, this.search).subscribe({
      next: (res) => {
        this.users = res.users;
        this.totalPages = res.totalPages || 1;
        this.totalUsers = res.totalUsers || 0;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  get hasSearch(): boolean {
    return !!this.search;
  }

  clearSearch() {
    this.router.navigate([], {
      queryParams: { search: null, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

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

  showDeletePopup(userId: string) {
    this.deleteId = userId;
    this.deletePopupVisible = true;
  }

  confirmDelete() {
    if (!this.deleteId) return;
    this.userService.deleteUser(this.deleteId, true).subscribe({
      next: () => {
        this.deletePopupVisible = false;
        this.deleteId = null;
        this.toastr.success('User deleted successfully', 'Success');
        this.fetchUsers();
      },
      error: () => {
        this.toastr.error('Error deleting user', 'Error');
      },
    });
  }
}
