import { NgModule } from '@angular/core'
import { BackButtonComponent } from 'src/app/components/shared/button/back-button/back-button.component'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { InfoTextComponent } from 'src/app/components/shared/text/info-text/info-text.component'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { PasswordResetRouterModule } from './password-reset-routing.module'
import { PasswordResetComponent } from './password-reset.component'

@NgModule({
  declarations: [PasswordResetComponent],
  imports: [
    PasswordResetRouterModule,
    FormModule,
    CenterTitleComponent,
    InfoTextComponent,
    BackButtonComponent,
  ],
  providers: [HttpAuthService],
  exports: [PasswordResetComponent],
})
export class PasswordResetModule {}
