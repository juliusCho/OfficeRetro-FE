import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkTextComponent } from './link-text.component';

describe('LinkTextComponent', () => {
  let component: LinkTextComponent;
  let fixture: ComponentFixture<LinkTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
