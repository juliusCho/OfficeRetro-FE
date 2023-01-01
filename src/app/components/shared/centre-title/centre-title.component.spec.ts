import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentreTitleComponent } from './centre-title.component';

describe('CentreTitleComponent', () => {
  let component: CentreTitleComponent;
  let fixture: ComponentFixture<CentreTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CentreTitleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentreTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
