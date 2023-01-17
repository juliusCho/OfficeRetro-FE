import { NgModule } from '@angular/core'
import { ButtonModule } from 'src/app/components/shared/button/button.module'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { LoginRouterModule } from './login-routing.module'
import LoginComponent from './login.component'

@NgModule({
  declarations: [LoginComponent],
  imports: [LoginRouterModule, FormModule, CenterTitleComponent, ButtonModule],
  providers: [HttpAuthService],
  exports: [LoginComponent],
})
export class LoginModule {}
