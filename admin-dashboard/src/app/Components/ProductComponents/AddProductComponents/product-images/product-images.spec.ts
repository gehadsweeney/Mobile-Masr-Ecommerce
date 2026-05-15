import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductImages } from './product-images';

describe('ProductImages', () => {
  let component: ProductImages;
  let fixture: ComponentFixture<ProductImages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductImages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductImages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
