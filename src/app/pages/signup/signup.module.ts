import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { BasePageModule } from '../base-page.module'
import { SignupRoutingModule } from './signup-routing.module'
import { SignupComponent } from './signup.component'

@NgModule({
  declarations: [SignupComponent],
  imports: [SharedModule, BasePageModule, SignupRoutingModule],
  exports: [SignupComponent],
})
export class SignupModule {}
