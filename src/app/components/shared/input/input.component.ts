import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent {
  @Input() label?: string
  @Input() type: 'email' | 'text' | 'password' = 'text'
  @Input() value = ''
  @Input() maxLength = 50
  @Input() width = ''
  @Input() isDisabled = false

  @Output() valueChange = new EventEmitter<string>()
  @Output() enter = new EventEmitter<void>()

  readonly onChange = (value: string) => {
    this.valueChange.emit(value)
  }

  readonly onEnter = () => {
    this.enter.emit()
  }
}
