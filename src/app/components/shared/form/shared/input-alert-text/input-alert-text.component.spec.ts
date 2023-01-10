import { ComponentFixture, TestBed } from '@angular/core/testing'

import { InputAlertTextComponent } from './input-alert-text.component'

describe('InputAlertTextComponent', () => {
  let component: InputAlertTextComponent
  let fixture: ComponentFixture<InputAlertTextComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputAlertTextComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(InputAlertTextComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
