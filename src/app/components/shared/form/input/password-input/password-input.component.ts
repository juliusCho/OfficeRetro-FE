import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { FormGroup } from '@angular/forms'
import { BehaviorSubject } from 'rxjs'

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent {
  @Input() label = 'Password'
  @Input() width = ''
  @Input() isDisabled = false
  @Input() minLength = 0
  @Input() maxLength = 50
  @Input() required = false
  @Input() form: FormGroup = new FormGroup({})
  @Input() formChange$ = new BehaviorSubject<string>('')
  @Input() infoTextType: 'none' | 'all' | 'alert' | 'length' = 'alert'
  @Input() validator?: (value?: string) => string
  @Input() showValidationMessage = false
  @Input() showPasswordResetIcon = false

  @Output() enter = new EventEmitter<void>()

  get getValidator(): (value?: string) => string {
    const _this = this

    return (value?: string) => {
      const result = _this.validator ? _this.validator(value) : ''

      if (result !== '') return result

      if (!value) return ''

      if (/ /g.test(value)) {
        return `${this.label} should not contain blank space`
      }

      return ''
    }
  }

  readonly onEnter = () => {
    this.enter.emit()
  }
}
