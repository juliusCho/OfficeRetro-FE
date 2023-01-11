import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordConfirmInputComponent } from './password-confirm-input.component';

describe('PasswordConfirmInputComponent', () => {
  let component: PasswordConfirmInputComponent;
  let fixture: ComponentFixture<PasswordConfirmInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordConfirmInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordConfirmInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
