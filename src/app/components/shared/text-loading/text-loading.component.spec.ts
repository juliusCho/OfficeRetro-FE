import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextLoadingComponent } from './text-loading.component';

describe('TextLoadingComponent', () => {
  let component: TextLoadingComponent;
  let fixture: ComponentFixture<TextLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
