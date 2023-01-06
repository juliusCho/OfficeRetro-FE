import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { SuperInputComponent } from '../../shared/base/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styles: [':host {width: 100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent extends SuperInputComponent<string> {
  @Input() valueChange$!: BehaviorSubject<string> // form.valueChange observable

  @Output() enter = new EventEmitter<void>()

  get inputSpec() {
    return {
      ...this.formInputSpec,
      type: 'password',
      validMessageGenerator: this.validate,
    }
  }

  get validate(): (value?: string) => string {
    const _this = this

    return (value?: string) => {
      if (this.isDisabled) return ''

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
