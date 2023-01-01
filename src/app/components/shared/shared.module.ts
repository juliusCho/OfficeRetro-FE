import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { AlertTextComponent } from './alert-text/alert-text.component'
import { ButtonComponent } from './button/button.component'
import { CentreTitleComponent } from './centre-title/centre-title.component'
import { FormComponent } from './form/form.component'
import { InputComponent } from './input/input.component'
import { LoadingComponent } from './loading/loading.component'
import { PasswordInputComponent } from './password-input/password-input.component'
import { PasswordResetButtonComponent } from './password-reset-button/password-reset-button.component'
import { TextLoadingComponent } from './text-loading/text-loading.component'
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
  FormComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule, FormsModule],
  exports: declarations,
})
export class SharedModule {}
