import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { TextComponent } from '../../text/text.component'
import { ButtonComponent } from '../button/button.component'
import { TextLoadingComponent } from '../loading/text-loading/text-loading.component'
import { TooltipComponent } from '../tooltip/tooltip.component'
import { AreaInputComponent } from './area-input/area-input.component'
import { CheckboxInputComponent } from './checkbox-input/checkbox-input.component'
import { DropdownInputComponent } from './dropdown-input/dropdown-input.component'
import { FormComponent } from './form.component'
import { InputComponent } from './input/input.component'
import { PasswordInputComponent } from './input/password-input/password-input.component'
import { PasswordResetButtonComponent } from './input/password-input/password-reset-button/password-reset-button.component'
import { RadioInputComponent } from './radio-input/radio-input.component'
import { AlertTextComponent } from './shared/alert-text/alert-text.component'
import { BaseInputComponent } from './shared/base-input/base-input.component'
import { BaseListInputComponent } from './shared/base-list-input.component.ts/base-list-input.component'
import { BaseSelectComponent } from './shared/base-select.component.ts/base-select.component'
import { LengthTextComponent } from './shared/length-text/length-text.component'
import { SuperInputComponent } from './shared/super-input.component'

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
]

@NgModule({
  declarations,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  exports: declarations,
})
export class FormModule {}
