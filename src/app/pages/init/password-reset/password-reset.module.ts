import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { PasswordResetRouterModule } from './password-reset-routing.module'
import { PasswordResetComponent } from './password-reset.component'

@NgModule({
  declarations: [PasswordResetComponent],
  imports: [
    SharedModule,
    PasswordResetRouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormModule,
  ],
  providers: [HttpAuthService],
  exports: [PasswordResetComponent],
})
export class PasswordResetModule {}
