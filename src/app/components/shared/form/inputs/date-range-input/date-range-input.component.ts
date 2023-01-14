import { ChangeDetectionStrategy, Component } from '@angular/core'
import { AbstractControl } from '@angular/forms'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import * as moment from 'moment'
import { isConvertibleToMoment } from 'src/app/helpers/type-checkers'
import { ICONS } from 'src/app/models/constants/css-constants'
import { DATE_DISPLAY_FORMAT } from 'src/app/models/constants/form-constants'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-date-range-input',
  templateUrl: './date-range-input.component.html',
  styleUrls: ['./date-range-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangeInputComponent extends SuperInputComponent<
  [string | undefined, string | undefined]
> {
  get calendarIcon() {
    return ICONS.CALENDAR
  }

  get defaultDateFormat() {
    return DATE_DISPLAY_FORMAT
  }

  get alertableControls(): [AbstractControl | null, AbstractControl | null] {
    return [
      this.getControlByName(`${this.name}Start`),
      this.getControlByName(`${this.name}End`),
    ]
  }

  readonly onTypeDate = (
    type: 'start' | 'end',
    event: MatDatepickerInputEvent<moment.Moment>,
  ) => {
    if (this.isDisabled) return
    if (isConvertibleToMoment(event.value)) return

    if (type === 'start') {
      this.getControlByName(`${this.name}Start`)?.setValue(undefined)
      this.getControlByName(`${this.name}Start`)?.markAsDirty()
      return
    }

    this.getControlByName(`${this.name}End`)?.setValue(undefined)
    this.getControlByName(`${this.name}End`)?.markAsDirty()
  }

  readonly onPickerClose = () => {
    this.getControlByName(`${this.name}Start`)?.markAsDirty()
    this.getControlByName(`${this.name}End`)?.markAsDirty()
  }
}
