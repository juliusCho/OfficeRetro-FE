import { Component, EventEmitter, Input, Output } from '@angular/core'

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
})
export class PasswordInputComponent {
  @Input() label = 'Password'
  @Input() value = ''
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
