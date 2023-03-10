import { NgModule } from '@angular/core'
import { ButtonModule } from 'src/app/components/shared/button/button.module'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { SignupRoutingModule } from './signup-routing.module'
import { SignupComponent } from './signup.component'

@NgModule({
  declarations: [SignupComponent],
  imports: [
    SignupRoutingModule,
    FormModule,
    CenterTitleComponent,
    ButtonModule,
  ],
  providers: [HttpAuthService],
  exports: [SignupComponent],
})
export class SignupModule {}
