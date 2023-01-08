import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styles: [':host {width: 100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent extends SuperInputComponent<string> {
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  @Output() enter = new EventEmitter<void>()

  get inputSpec() {
    return {
      ...this.formInputSpec,
      type: 'password',
      validMessageGenerator: this.validate,
    }
  }

  get validate(): ((value?: string) => string) | undefined {
    if (this.isDisabled || !this.isValidationNeeded) return

    const _this = this

    return (value?: string) => {
      const result = _this.formInputSpec.validMessageGenerator
        ? _this.formInputSpec.validMessageGenerator(value)
        : ''
      if (result !== '') return result

      if (!value) return ''

      if (/ /g.test(value)) {
        return `${(this.label ?? 'This field').replace(
          /\n/g,
          ' ',
        )} should not contain blank space`
      }

      return ''
    }
  }

  readonly onEnter = () => {
    this.enter.emit()
  }
}
