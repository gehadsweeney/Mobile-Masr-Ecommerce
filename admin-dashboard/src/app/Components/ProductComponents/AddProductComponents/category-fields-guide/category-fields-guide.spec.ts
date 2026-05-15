import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFieldsGuide } from './category-fields-guide';

describe('CategoryFieldsGuide', () => {
  let component: CategoryFieldsGuide;
  let fixture: ComponentFixture<CategoryFieldsGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryFieldsGuide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryFieldsGuide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
