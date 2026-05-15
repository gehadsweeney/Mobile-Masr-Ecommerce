import { Component, OnInit } from '@angular/core';
import { CategoryServices } from '../../../Services/category-services';
import { Icategory } from '../../../Models/icategory';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UploadService } from '../../../Services/upload-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss']
})
export class Categories implements OnInit {
  categories: Icategory[] = [];
  allCategories: Icategory[] = [];
  loading = false;
  search: string = '';
  showEditModal = false;
  editingCategory: Icategory | null = null;
  editForm: FormGroup;
  editImage = '';
  editImagePreview: string | null = null;
  uploadingEdit = false;
  submitting = false;
  showDeleteConfirm = false;
  deleteTargetId: string | null = null;
  deleteTargetName: string = '';

  constructor(
    private categoryService: CategoryServices,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private uploadService: UploadService
  ) {
    this.editForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.search = params['search'] || '';
      this.fetchCategories();
    });
  }

  fetchCategories() {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.allCategories = res;
        this.filterCategories();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
      }
    });
  }

  filterCategories() {
    if (!this.search) {
      this.categories = this.allCategories;
      return;
    }

    const searchLower = this.search.toLowerCase();
    this.categories = this.allCategories.filter(
      (category) =>
        category.name?.toLowerCase().includes(searchLower)
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

  openEditModal(cat: Icategory) {
    this.editingCategory = cat;
    this.editForm.patchValue({ name: cat.name });
    this.editImage = cat.image;
    this.editImagePreview = cat.image;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.editingCategory = null;
    this.editForm.reset();
    this.editImage = '';
    this.editImagePreview = null;
    this.uploadingEdit = false;
    this.submitting = false;
  }

  onEditImageSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // Show preview
    const reader = new FileReader();
    reader.onload = () => {
      this.editImagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.uploadingEdit = true;

    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.editImage = res.secure_url;
        this.uploadingEdit = false;
        this.toastr.success('Image uploaded');
      },
      error: () => {
        this.uploadingEdit = false;
        this.toastr.error('Upload failed');
      },
    });

    input.value = '';
  }

  removeEditImage() {
    this.editImage = '';
    this.editImagePreview = null;
  }

  hasEditChanges(): boolean {
    if (!this.editingCategory) return false;
    return (
      this.editForm.value.name !== this.editingCategory.name ||
      this.editImage !== this.editingCategory.image
    );
  }

  submitEdit() {
    if (this.editForm.invalid || !this.editingCategory) {
      console.error('Form invalid or no category selected');
      return;
    }

    if (!this.hasEditChanges()) {
      this.toastr.info('No changes detected');
      return;
    }

    this.submitting = true;

    const updateData = {
      name: this.editForm.value.name,
      image: this.editImage || this.editingCategory.image
    };

    const categoryId = this.editingCategory._id || '';
    
    if (!categoryId) {
      console.error('Category ID is empty!');
      this.toastr.error('Category ID is missing');
      this.submitting = false;
      return;
    }

    console.log('Updating category with ID:', categoryId);
    console.log('Update data:', updateData);

    this.categoryService.updateCategory(categoryId, updateData).subscribe({
      next: () => {
        this.toastr.success('Category updated successfully!');
        this.fetchCategories();
        this.closeEditModal();
      },
      error: (err) => {
        console.error('Update Error:', err);
        console.error('Error status:', err.status);
        console.error('Error URL:', err.url);
        this.toastr.error('Failed to update category');
        this.submitting = false;
      }
    });
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

    this.categoryService.deleteCategory(this.deleteTargetId).subscribe({
      next: () => {
        this.toastr.success('Category deleted successfully!', 'Success');
        this.categories = this.categories.filter(cat => cat._id !== this.deleteTargetId);
        this.closeDeleteConfirm();
      },
      error: (err) => {
        console.error('Error:', err);
        this.toastr.error('Failed to delete category', 'Error');
        this.closeDeleteConfirm();
      }
    });
  }
}
