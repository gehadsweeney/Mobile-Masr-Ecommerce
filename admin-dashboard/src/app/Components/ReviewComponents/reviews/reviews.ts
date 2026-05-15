import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { ReviewServices } from '../../../Services/review-services';
import { Ireview } from '../../../Models/ireview';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, DatePipe, ToastrModule],
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.scss'],
})
export class Reviews implements OnInit {
  reviews: Ireview[] = [];
  isLoading = false;
  errorMsg = '';

  // Delete confirm popup variables
  showDeleteConfirm = false;
  deleteTargetId: string | null = null;
  deleteTargetName = '';

  constructor(
    private reviewService: ReviewServices,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
  }

  // Load all reviews
  loadReviews() {
    this.isLoading = true;
    this.reviewService.getAllReviews().subscribe({
      next: (data) => {
        this.reviews = data.map(r => ({
          ...r,
           createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
  user: typeof r.user === 'object' && r.user !== null ? r.user.name : r.user
        }));
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading = false;
        this.errorMsg = 'Error loading reviews';
        this.toastr.error('Error loading reviews', 'Error');
      },
    });
  }
getUserName(user: string | { name: string } | null | undefined): string {
  if (!user) return 'Unknown';
  if (typeof user === 'string') return user;
  return user.name || 'Unknown';
}

  // Open delete confirmation popup
  openDeleteConfirm(id: string, name: string) {
    this.deleteTargetId = id;
    this.deleteTargetName = name;
    this.showDeleteConfirm = true;
  }

  // Close delete popup
  closeDeleteConfirm() {
    this.showDeleteConfirm = false;
    this.deleteTargetId = null;
    this.deleteTargetName = '';
  }

  // Confirm delete action
  confirmDelete() {
    if (!this.deleteTargetId) return;

    this.reviewService.deleteReview(this.deleteTargetId).subscribe({
      next: () => {
        // Remove deleted review from UI
        this.reviews = this.reviews.filter(r => r._id !== this.deleteTargetId);
        this.toastr.success('Review deleted successfully', 'Success'); // البوب
        this.closeDeleteConfirm();
      },
      error: (err: any) => {
        console.error('Error deleting review:', err);
        this.toastr.error('Error deleting review', 'Error'); // البوب
        this.closeDeleteConfirm();
      },
    });
  }
}
