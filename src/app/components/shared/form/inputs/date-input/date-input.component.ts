import { ChangeDetectionStrategy, Component } from '@angular/core'
import { MatDatepickerInputEvent } from '@angular/material/datepicker'
import * as moment from 'moment'
import { ICONS } from 'src/app/models/constants/css-constants'
import { DATE_DISPLAY_FORMAT } from 'src/app/models/constants/form-constants'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateInputComponent extends SuperInputComponent<
  string | undefined
> {
  get calendarIcon() {
    return ICONS.CALENDAR
  }

  get defaultDateFormat() {
    return DATE_DISPLAY_FORMAT
  }

  readonly onTypeDate = (event: MatDatepickerInputEvent<moment.Moment>) => {
    if (this.isDisabled) return
    if (moment(event.value).isValid()) return

    this.control?.setValue(undefined)
    this.control?.markAsDirty()
    this.control?.markAsTouched()
  }

  readonly onPickerClose = () => {
    this.control?.markAsDirty()
    this.control?.markAsTouched()
  }
}
