import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBrand } from './add-brand';

describe('AddBrand', () => {
  let component: AddBrand;
  let fixture: ComponentFixture<AddBrand>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBrand]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBrand);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
