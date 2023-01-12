import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import * as moment from 'moment'
import { Observable, of, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicDateInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { ICONS } from 'src/app/models/constants/css-constants'
import { BaseDateInputComponent } from '../inheritances/base-date-input/base-date-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent
  extends BaseDateInputComponent<string | undefined>
  implements AfterContentInit
{
  private _valueChangeSubscription$?: Subscription

  get calendarIcon() {
    return ICONS.CALENDAR
  }

  get valueChange$() {
    return (this.form.get(this.name)?.valueChanges ?? of()) as Observable<
      string | undefined
    >
  }

  ngAfterContentInit(): void {
    if (this.isDisabled) {
      this.form?.get(this.name)?.disable()
      return
    }

    this.form?.get(this.name)?.enable()

    this._valueChangeSubscription$ = this.valueChange$
      ?.pipe(
        tap((v) => {
          this.showValidationMessage = false
          this.validationMessage = this.validate(v)

          this.changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()
  }

  readonly selectDate = (event: MatDatepickerInputEvent<moment.Moment>) => {
    if (this.isDisabled) return

    if (!moment(event.value).isValid()) {
      this.setFormValueAndShowMessage(this.name)
    }

    this.onFocusOut()
  }

  readonly validate = (value?: string) => {
    if (this.isDisabled || !this.isValidationNeeded) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    return getBasicDateInputValidationMsg({
      value,
      label: this.label,
      required: this.required,
      max: this.max,
      min: this.min,
    })
  }
}
