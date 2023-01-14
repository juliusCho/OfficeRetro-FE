import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { InputType } from 'src/app/models/client-specs/form/form-input-types'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styles: [':host {width: 100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordInputComponent extends SuperInputComponent<string> {
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  get inputParam() {
    return {
      ...this.input,
      formInputSpec: {
        ...this.formInputSpec,
        inputType: 'password' as InputType,
      },
    }
  }
}
