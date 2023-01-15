import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { ButtonComponent } from 'src/app/components/shared/button/button.component'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { LoginRouterModule } from './login-routing.module'
import LoginComponent from './login.component'

@NgModule({
  declarations: [LoginComponent],
  imports: [
    LoginRouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    CenterTitleComponent,
    ButtonComponent,
  ],
  providers: [HttpAuthService],
  exports: [LoginComponent],
})
export class LoginModule {}
