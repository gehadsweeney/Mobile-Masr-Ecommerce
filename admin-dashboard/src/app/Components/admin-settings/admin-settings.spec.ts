import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSettings } from './admin-settings';

describe('AdminSettings', () => {
  let component: AdminSettings;
  let fixture: ComponentFixture<AdminSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
