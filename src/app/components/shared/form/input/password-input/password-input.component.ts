import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { SuperInputComponent } from '../../shared/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent extends SuperInputComponent {
  @Input() formChange$?: BehaviorSubject<string> // form.valueChange observable
  @Input() validator?: (value?: string) => string // fn for validate value & get invalid message
  @Input() showPasswordResetIcon = false

  @Output() enter = new EventEmitter<void>()

  get validate(): (value?: string) => string {
    const _this = this

    return (value?: string) => {
      if (this.isDisabled) return ''

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
