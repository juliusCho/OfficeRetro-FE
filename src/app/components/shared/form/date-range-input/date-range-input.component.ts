import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import * as moment from 'moment'
import { Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicDateRangeInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { BaseDateInputComponent } from '../shared/base/bsae-date-input/base-date-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeInputComponent extends BaseDateInputComponent<
  [string | undefined, string | undefined]
> {
  private _valueChangeSubscription$?: Subscription

  override ngOnInit(): void {
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
      this.form
        .get(`${this.name}${type === 'start' ? 'Start' : 'End'}`)
        ?.setValue(undefined)

      if (this.validationMessage) {
        this.validationMessage = `${(this.label ?? 'This field').replace(
          /\\n/g,
          ' ',
        )} must be filled in correct format of "DD/MM/YYYY"`
      }
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
