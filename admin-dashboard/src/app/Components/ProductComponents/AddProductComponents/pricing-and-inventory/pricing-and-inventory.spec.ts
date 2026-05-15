import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingAndInventory } from './pricing-and-inventory';

describe('PricingAndInventory', () => {
  let component: PricingAndInventory;
  let fixture: ComponentFixture<PricingAndInventory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PricingAndInventory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PricingAndInventory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
