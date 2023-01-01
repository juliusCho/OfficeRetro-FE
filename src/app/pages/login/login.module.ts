import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { BasePageModule } from '../base-page.module'
import { LoginRouterModule } from './login-routing.module'
import { LoginComponent } from './login.component'

@NgModule({
  declarations: [LoginComponent],
  imports: [SharedModule, BasePageModule, LoginRouterModule],
  exports: [LoginComponent],
})
export class LoginModule {}
