import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import * as moment from 'moment'
import { Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicDateRangeInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { ICONS } from 'src/app/models/constants/css-constants'
import { BaseDateInputComponent } from '../inheritances/base-date-input/base-date-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeInputComponent
  extends BaseDateInputComponent<[string | undefined, string | undefined]>
  implements AfterContentInit
{
  private _valueChangeSubscription$?: Subscription

  get calendarIcon() {
    return ICONS.CALENDAR
  }

  ngAfterContentInit(): void {
    if (this.isDisabled) {
      this.form?.get(`${this.name}Start`)?.disable()
      this.form?.get(`${this.name}End`)?.disable()
      return
    }

    this.form?.get(`${this.name}Start`)?.enable()
    this.form?.get(`${this.name}End`)?.enable()

    this._valueChangeSubscription$ = this.valueChange$
      .pipe(
        tap((v) => {
          this.showValidationMessage = false
          this.validationMessage = this.validate(v)

          this.changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()
  }

  readonly selectDateRange = (
    type: 'start' | 'end',
    event: MatDatepickerInputEvent<moment.Moment>,
  ) => {
    if (this.isDisabled) return

    if (!moment(event.value).isValid()) {
      this.setFormValueAndShowMessage(
        `${this.name}${type === 'start' ? 'Start' : 'End'}`,
      )
    }

    this.onFocusOut()
  }

  readonly validate = (value?: [string | undefined, string | undefined]) => {
    if (this.isDisabled || !this.isValidationNeeded) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    return getBasicDateRangeInputValidationMsg({
      value,
      label: this.label,
      required: this.required,
      max: this.max,
      min: this.min,
    })
  }
}
