import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LengthTextComponent } from './length-text.component';

describe('LengthTextComponent', () => {
  let component: LengthTextComponent;
  let fixture: ComponentFixture<LengthTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LengthTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LengthTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
