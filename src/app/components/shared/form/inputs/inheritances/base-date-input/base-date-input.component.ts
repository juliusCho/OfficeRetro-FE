import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core'
import * as moment from 'moment'
import { isDate } from 'src/app/helpers/type-checkers'
import { SuperInputComponent } from '../super-input.component'

@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDateInputComponent<T> extends SuperInputComponent<T> {
  @Output() enter = new EventEmitter<void>()

  get validator() {
    return this.isValidationNeeded
      ? this.formInputSpec?.validMessageGenerator
      : undefined
  }

  get minDate() {
    return isDate(this.formInputSpec?.min)
      ? moment(this.formInputSpec.min)
      : undefined
  }
  get maxDate() {
    return isDate(this.formInputSpec?.max)
      ? moment(this.formInputSpec.max).toDate()
      : undefined
  }

  protected readonly onPickerClose = () => {
    if (this.isDisabled) return

    this.onFocusOut()
  }

  protected readonly setFormValueAndShowMessage = (formKey: string) => {
    this.form.get(formKey)?.setValue(undefined)

    if (!this.isValidationNeeded) return

    this.validationMessage = `${(this.label ?? 'This field').replace(
      /\\n/g,
      ' ',
    )} must be filled in correct format of "DD/MM/YYYY"`

    this.changeDetectorRef.markForCheck()
  }

  protected readonly onEnter = () => {
    this.showValidationMessage = true

    this.changeDetectorRef.markForCheck()

    this.enter.emit()
  }
}
