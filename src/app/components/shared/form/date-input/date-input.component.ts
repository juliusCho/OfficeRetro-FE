import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import * as moment from 'moment'
import { Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicDateInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { BaseDateInputComponent } from '../shared/base/bsae-date-input/base-date-input.component'

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

  ngAfterContentInit(): void {
    this._valueChangeSubscription$ = this._valueChangeObservable$
      ?.pipe(
        tap((v) => {
          this.validationMessage = this.validate(v)

          this._changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()

    this._changeDetectorRef.detectChanges()
  }

  readonly selectDate = (event: MatDatepickerInputEvent<moment.Moment>) => {
    if (this.isDisabled) return

    if (!moment(event.value).isValid()) {
      this.form.get(this.name)?.setValue(undefined)

      this.validationMessage = `${(this.label ?? 'This field').replace(
        /\\n/g,
        ' ',
      )} must be filled in correct format of "DD/MM/YYYY"`
    }

    this.onFocusOut()
  }

  readonly validate = (value?: string) => {
    if (this.isDisabled) return ''

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
