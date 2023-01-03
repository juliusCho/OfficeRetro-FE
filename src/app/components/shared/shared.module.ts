import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonComponent } from './button/button.component'
import { CentreTitleComponent } from './centre-title/centre-title.component'
import { AreaInputComponent } from './form/area-input/area-input.component'
import { CheckboxInputComponent } from './form/checkbox-input/checkbox-input.component'
import { DropdownInputComponent } from './form/dropdown-input/dropdown-input.component'
import { FormModule } from './form/form.module'
import { InputComponent } from './form/input/input.component'
import { LengthTextComponent } from './form/input/length-text/length-text.component'
import { PasswordInputComponent } from './form/input/password-input/password-input.component'
import { PasswordResetButtonComponent } from './form/input/password-input/password-reset-button/password-reset-button.component'
import { RadioInputComponent } from './form/radio-input/radio-input.component'
import { LoadingComponent } from './loading/loading.component'
import { TextLoadingComponent } from './loading/text-loading/text-loading.component'
import { AlertTextComponent } from './text/alert-text/alert-text.component'
import { TextComponent } from './text/text.component'
import { TooltipComponent } from './tooltip/tooltip.component'

export const declarations = [
  AlertTextComponent,
  TextComponent,
  ButtonComponent,
  CentreTitleComponent,
  InputComponent,
  TooltipComponent,
  PasswordResetButtonComponent,
  PasswordInputComponent,
  LoadingComponent,
  TextLoadingComponent,
  LengthTextComponent,
  AreaInputComponent,
  DropdownInputComponent,
  RadioInputComponent,
  CheckboxInputComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule, ReactiveFormsModule, FormModule, HttpClientModule],
  exports: declarations,
})
export class SharedModule {}
