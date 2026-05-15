import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralInfo } from '../general-info/general-info';
import { PricingAndInventory } from '../pricing-and-inventory/pricing-and-inventory';
import { ProductImages } from '../product-images/product-images';
import { TechnicalSpec } from '../technical-spec/technical-spec';
import { ProductServices } from '../../../../Services/product-services';
import { Iproduct } from '../../../../Models/iproduct';
import { ToastrService } from 'ngx-toastr';
import { CategoryFieldsGuide } from '../category-fields-guide/category-fields-guide';
import { Loader } from '../../../loader/loader';

@Component({
  selector: 'app-add-product',
  imports: [
    ReactiveFormsModule,
    GeneralInfo,
    PricingAndInventory,
    ProductImages,
    TechnicalSpec,
    CategoryFieldsGuide,
    Loader,
  ],
  templateUrl: './add-product.html',
  styleUrl: './add-product.scss',
})
export class AddProduct implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;
  showGuide: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductServices,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      generalInfo: this.fb.group({
        name: this.fb.group({
          en: ['', [Validators.required, Validators.minLength(3)]],
          ar: ['', [Validators.required, Validators.minLength(3)]],
        }),
        description: this.fb.group({
          en: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
          ar: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(1000)]],
        }),
        category: ['', [Validators.required]],
        brand: ['', [Validators.required]],
        vendor: [''],
        condition: this.fb.group({
          en: ['new', Validators.required],
          ar: ['جديد', Validators.required],
        }),
        color: [''],
      }),
      pricingAndInventory: this.fb.group({
        price: ['', [Validators.required, Validators.min(0)]],
        discount: [0, [Validators.min(0), Validators.max(100)]],
        skuCode: ['', [Validators.required]],
        stock: [0, [Validators.min(0)]],
        guarantee: this.fb.group({
          en: [''],
          ar: [''],
        }),
      }),
      productImages: this.fb.group({
        images: [[]],
      }),
      technicalSpec: this.fb.group({
        storage: [''],
        ram: [[]],
        processor: [''],
        gpu: [''],
        hdd: [''],
        ssd: [''],
        batteryCapacity: [''],
        batteryStatus: this.fb.group({
          en: [''],
          ar: [''],
        }),
        simCard: [''],
        screenSize: [''],
        camera: [''],
        weight: [''],
        accessories: this.fb.group({
          en: [[]],
          ar: [[]],
        }),
      }),
    });
  }
  // ====================ONInit==================
  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.isLoading = true;
      this.loadProductData(this.productId);
    }

    // Subscribe to form changes to log values
    this.productForm.valueChanges.subscribe((value) => {
      console.log('===== Product Form Updated =====');
      console.log('Full Form Value:', value);
      console.log('Form Valid:', this.productForm.valid);
      console.log('================================');
    });
  }

  // ========== Load Product Data for Edit ==========
  loadProductData(id: string): void {
    this.productService.getProductById(id).subscribe({
      next: (response) => {
        const product: any = Array.isArray(response.data) ? response.data[0] : response.data;
        this.productForm.patchValue({
          generalInfo: {
            name: product.name || { en: '', ar: '' },
            description: product.description || { en: '', ar: '' },
            category: product.category?._id || product.category || '',
            brand: product.brand?._id || product.brand || '',
            vendor: product.vendor?._id || product.vendor || '',
            condition: product.condition || { en: 'new', ar: 'جديد' },
            color: product.color || '',
          },
          pricingAndInventory: {
            price: product.price || 0,
            discount: product.discount || 0,
            skuCode: product.skuCode || '',
            stock: product.stock || 0,
            guarantee: product.guarantee || { en: '', ar: '' },
          },
          productImages: {
            images: product.images || [],
          },
          technicalSpec: {
            storage: product.storage || '',
            ram: product.ram || [],
            processor: product.processor || '',
            gpu: product.gpu || '',
            hdd: product.hdd || '',
            ssd: product.ssd || '',
            batteryCapacity: product.batteryCapacity || '',
            batteryStatus: product.batteryStatus || { en: '', ar: '' },
            simCard: product.simCard || '',
            screenSize: product.screenSize || '',
            camera: product.camera || '',
            weight: product.weight || '',
            accessories: product.accessories || { en: [], ar: [] },
          },
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.toastr.error('Failed to load product data', 'Error');
        this.isLoading = false;
        this.router.navigate(['/admin/products']);
      },
    });
  }

  // ========== Getters for Form Groups ==========
  get generalInfoGroup(): FormGroup {
    return this.productForm.get('generalInfo') as FormGroup;
  }
  get pricingAndInventoryGroup(): FormGroup {
    return this.productForm.get('pricingAndInventory') as FormGroup;
  }
  get productImagesGroup(): FormGroup {
    return this.productForm.get('productImages') as FormGroup;
  }
  get technicalSpecGroup(): FormGroup {
    return this.productForm.get('technicalSpec') as FormGroup;
  }

  // ========== Guide Modal ==========
  openGuide(): void {
    this.showGuide = true;
  }

  closeGuide(): void {
    this.showGuide = false;
  }

  // ========== Submit Product ==========
  onSubmit(): void {
    if (this.productForm.invalid) {
      console.error('Form is invalid');
      return;
    }

    const formValue = this.productForm.value;

    // Transform form data to IProduct structure
    const productData: Iproduct = {
      name: formValue.generalInfo.name,
      description: formValue.generalInfo.description,
      category: formValue.generalInfo.category,
      brand: formValue.generalInfo.brand,
      vendor: formValue.generalInfo.vendor || undefined,
      condition: formValue.generalInfo.condition,
      color: formValue.generalInfo.color || undefined,

      price: Number(formValue.pricingAndInventory.price),
      discount: Number(formValue.pricingAndInventory.discount) || undefined,
      skuCode: formValue.pricingAndInventory.skuCode,
      stock: Number(formValue.pricingAndInventory.stock) || undefined,
      guarantee: formValue.pricingAndInventory.guarantee,

      images: formValue.productImages.images || undefined,

      storage: formValue.technicalSpec.storage || undefined,
      ram: formValue.technicalSpec.ram?.length > 0 ? formValue.technicalSpec.ram : undefined,
      processor: formValue.technicalSpec.processor || undefined,
      gpu: formValue.technicalSpec.gpu || undefined,
      hdd: formValue.technicalSpec.hdd || undefined,
      ssd: formValue.technicalSpec.ssd || undefined,
      batteryCapacity: formValue.technicalSpec.batteryCapacity || undefined,
      batteryStatus: formValue.technicalSpec.batteryStatus,
      simCard: formValue.technicalSpec.simCard || undefined,
      screenSize: formValue.technicalSpec.screenSize || undefined,
      camera: formValue.technicalSpec.camera || undefined,
      weight: formValue.technicalSpec.weight || undefined,
      accessories: formValue.technicalSpec.accessories,
    };

    // Remove undefined fields
    Object.keys(productData).forEach((key) => {
      if (productData[key as keyof Iproduct] === undefined) {
        delete productData[key as keyof Iproduct];
      }
    });

    console.log('Product Data to Submit:', productData);

    if (this.isEditMode && this.productId) {
      // Update existing product
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: (response) => {
          console.log('Product updated successfully:', response);
          this.toastr.success('Product updated successfully!', 'Success');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error updating product:', error);
          this.toastr.error('Error updating product. Please try again.', 'Error');
        },
      });
    } else {
      // Add new product
      this.productService.addProduct(productData).subscribe({
        next: (response) => {
          console.log('Product added successfully:', response);
          this.toastr.success('Product added successfully!', 'Success');
          this.router.navigate(['/admin/products']);
        },
        error: (error) => {
          console.error('Error adding product:', error);
          this.toastr.error('Error adding product. Please try again.', 'Error');
        },
      });
    }
  }
}
