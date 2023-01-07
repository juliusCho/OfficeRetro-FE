import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import * as moment from 'moment'
import { BehaviorSubject } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { isDate } from 'src/app/helpers/type-checkers'
import { SuperInputComponent } from '../super-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDateInputComponent<T> extends SuperInputComponent<T> {
  @Input() valueChange$!: BehaviorSubject<T>

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
}
