import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styles: [':host {width: 100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorInputComponent extends SuperInputComponent<[string, string]> {
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  get color() {
    return this.getControlByName(`${this.name}Color`)?.value
  }

  get inputParam() {
    return {
      ...this.input,
      formInputSpec: {
        ...this.formInputSpec,
        initValue: this.formInputSpec.initValue[0],
      },
    }
  }

  readonly onSelectColor = (value: string) => {
    this.getControlByName(`${this.name}Color`)?.setValue(value)
    this.getControlByName(`${this.name}Color`)?.markAsDirty()
  }
}
