import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInfo } from './general-info';

describe('GeneralInfo', () => {
  let component: GeneralInfo;
  let fixture: ComponentFixture<GeneralInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
