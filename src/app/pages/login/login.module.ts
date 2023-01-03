import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { LoginRouterModule } from './login-routing.module'
import LoginComponent from './login.component'

@NgModule({
  declarations: [LoginComponent],
  imports: [
    SharedModule,
    LoginRouterModule,
    CommonModule,
    ReactiveFormsModule,
    FormModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
