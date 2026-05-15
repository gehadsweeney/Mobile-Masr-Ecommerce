import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalSpec } from './technical-spec';

describe('TechnicalSpec', () => {
  let component: TechnicalSpec;
  let fixture: ComponentFixture<TechnicalSpec>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TechnicalSpec]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnicalSpec);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
