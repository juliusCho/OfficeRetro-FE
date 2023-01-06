import { ComponentFixture, TestBed } from '@angular/core/testing'

import { CenterTitleComponent } from './center-title.component'

describe('CenterTitleComponent', () => {
  let component: CenterTitleComponent
  let fixture: ComponentFixture<CenterTitleComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CenterTitleComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(CenterTitleComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
