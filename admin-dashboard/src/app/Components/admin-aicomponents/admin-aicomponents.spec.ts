import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAIComponents } from './admin-aicomponents';

describe('AdminAIComponents', () => {
  let component: AdminAIComponents;
  let fixture: ComponentFixture<AdminAIComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAIComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAIComponents);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
