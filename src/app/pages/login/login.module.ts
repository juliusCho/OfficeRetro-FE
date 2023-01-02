import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BaseInputModule } from 'src/app/components/shared/form/shared/base-input/base-input.module'
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
    BaseInputModule,
  ],
  exports: [LoginComponent],
})
export class LoginModule {}
