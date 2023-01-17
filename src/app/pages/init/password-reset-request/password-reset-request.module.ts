import { NgModule } from '@angular/core'
import { ButtonModule } from 'src/app/components/shared/button/button.module'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { TextModule } from 'src/app/components/shared/text/text.module'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { PasswordResetRequestRouterModule } from './password-reset-request-routing.module'
import { PasswordResetRequestComponent } from './password-reset-request.component'

@NgModule({
  declarations: [PasswordResetRequestComponent],
  imports: [
    PasswordResetRequestRouterModule,
    FormModule,
    CenterTitleComponent,
    TextModule,
    ButtonModule,
  ],
  providers: [HttpAuthService],
  exports: [PasswordResetRequestComponent],
})
export class PasswordResetRequestModule {}
