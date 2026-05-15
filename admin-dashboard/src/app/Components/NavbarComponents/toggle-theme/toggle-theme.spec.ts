import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleTheme } from './toggle-theme';

describe('ToggleTheme', () => {
  let component: ToggleTheme;
  let fixture: ComponentFixture<ToggleTheme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleTheme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleTheme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
