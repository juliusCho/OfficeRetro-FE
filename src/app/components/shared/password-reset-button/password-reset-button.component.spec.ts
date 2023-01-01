import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordResetButtonComponent } from './password-reset-button.component';

describe('PasswordResetButtonComponent', () => {
  let component: PasswordResetButtonComponent;
  let fixture: ComponentFixture<PasswordResetButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordResetButtonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordResetButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
