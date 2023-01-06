import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { TextComponent } from '../../text/text.component'
import { ButtonComponent } from '../button/button.component'
import { TextLoadingComponent } from '../loading/text-loading/text-loading.component'
import { TooltipComponent } from '../tooltip/tooltip.component'
import { AreaInputComponent } from './area-input/area-input.component'
import { CheckboxInputComponent } from './checkbox-input/checkbox-input.component'
import { DateInputComponent } from './date-input/date-input.component'
import { DateRangeInputComponent } from './date-range-input/date-range-input.component'
import { DropdownInputComponent } from './dropdown-input/dropdown-input.component'
import { FormComponent } from './form.component'
import { InputComponent } from './input/input.component'
import { PasswordInputComponent } from './input/password-input/password-input.component'
import { PasswordResetButtonComponent } from './input/password-input/password-reset-button/password-reset-button.component'
import { RadioInputComponent } from './radio-input/radio-input.component'
import { AlertTextComponent } from './shared/alert-text/alert-text.component'
import { BaseInputComponent } from './shared/base/base-input/base-input.component'
import { BaseSelectComponent } from './shared/base/base-input/base-select-input/base-select.component'
import { BaseListInputComponent } from './shared/base/base-list-input/base-list-input.component'
import { BaseDateInputComponent } from './shared/base/bsae-date-input/base-date-input.component'
import { SuperInputComponent } from './shared/base/super-input.component'
import { InputLabelComponent } from './shared/input-label/input-label.component'
import { LengthTextComponent } from './shared/length-text/length-text.component'

const declarations = [
  TextComponent,
  BaseInputComponent,
  FormComponent,
  BaseSelectComponent,
  BaseListInputComponent,
  SuperInputComponent,
  InputComponent,
  AlertTextComponent,
  LengthTextComponent,
  AreaInputComponent,
  DropdownInputComponent,
  RadioInputComponent,
  CheckboxInputComponent,
  TextLoadingComponent,
  ButtonComponent,
  TooltipComponent,
  PasswordResetButtonComponent,
  PasswordInputComponent,
  InputLabelComponent,
  DateRangeInputComponent,
  DateInputComponent,
  BaseDateInputComponent,
]

@NgModule({
  declarations,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatMomentDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-NZ' },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'DD/MM/YYYY',
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  exports: declarations,
})
export class FormModule {}
