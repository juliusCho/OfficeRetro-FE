import { DragDropModule } from '@angular/cdk/drag-drop'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { MatMomentDateModule } from '@angular/material-moment-adapter'
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { ColorPickerModule } from 'ngx-color-picker'
import { DATE_DISPLAY_FORMAT } from 'src/app/models/constants/form-constants'
import { ButtonModule } from '../button/button.module'
import { LoadingModule } from '../loading/loading.module'
import { TextModule } from '../text/text.module'
import { TooltipComponent } from '../tooltip/tooltip.component'
import { InputFormComponent } from './input-form/input-form.component'
import { AreaInputComponent } from './inputs/area-input/area-input.component'
import { CheckboxInputComponent } from './inputs/checkbox-input/checkbox-input.component'
import { ColorInputComponent } from './inputs/color-input/color-input.component'
import { ColorPickerComponent } from './inputs/color-input/color-picker/color-picker.component'
import { DateInputComponent } from './inputs/date-input/date-input.component'
import { DateRangeInputComponent } from './inputs/date-range-input/date-range-input.component'
import { DropdownInputComponent } from './inputs/dropdown-input/dropdown-input.component'
import { BaseSelectInputComponent } from './inputs/inheritances/base-select-input/base-select-input.component'
import { SuperInputComponent } from './inputs/inheritances/super-input.component'
import { ListInputComponent } from './inputs/list-input/list-input.component'
import { PasswordConfirmInputComponent } from './inputs/password-confirm-input/password-confirm-input.component'
import { PasswordInputComponent } from './inputs/password-input/password-input.component'
import { PasswordResetButtonComponent } from './inputs/password-input/password-reset-button/password-reset-button.component'
import { RadioInputComponent } from './inputs/radio-input/radio-input.component'
import { TextInputComponent } from './inputs/text-input/text-input.component'
import { InputAlertTextComponent } from './shared/input-alert-text/input-alert-text.component'
import { InputLabelComponent } from './shared/input-label/input-label.component'
import { LengthTextComponent } from './shared/length-text/length-text.component'

export const declarations = [
  InputFormComponent,
  BaseSelectInputComponent,
  SuperInputComponent,
  TextInputComponent,
  InputAlertTextComponent,
  LengthTextComponent,
  AreaInputComponent,
  DropdownInputComponent,
  RadioInputComponent,
  CheckboxInputComponent,
  PasswordResetButtonComponent,
  PasswordInputComponent,
  InputLabelComponent,
  DateRangeInputComponent,
  DateInputComponent,
  ColorInputComponent,
  ColorPickerComponent,
  ListInputComponent,
  PasswordConfirmInputComponent,
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
    ColorPickerModule,
    DragDropModule,
    TextModule,
    ButtonModule,
    LoadingModule,
    TooltipComponent,
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
          dateInput: DATE_DISPLAY_FORMAT,
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: DATE_DISPLAY_FORMAT,
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
  ],
  exports: declarations,
})
export class FormModule {}
