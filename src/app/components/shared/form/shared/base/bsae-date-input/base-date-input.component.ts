import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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

  constructor(
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(changeDetectorRef)
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

    this.changeDetectorRef.detectChanges()
  }

  protected readonly onEnter = () => {
    this.showValidationMessage = true

    this.changeDetectorRef.detectChanges()

    this.enter.emit()
  }
}
