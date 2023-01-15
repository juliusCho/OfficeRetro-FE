import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InquiryListComponent } from './inquiry-list.component';

describe('InquiryListComponent', () => {
  let component: InquiryListComponent;
  let fixture: ComponentFixture<InquiryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InquiryListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InquiryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
