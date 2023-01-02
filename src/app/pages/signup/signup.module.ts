import { NgModule } from '@angular/core'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { SignupRoutingModule } from './signup-routing.module'
import { SignupComponent } from './signup.component'

@NgModule({
  declarations: [SignupComponent],
  imports: [SharedModule, SignupRoutingModule],
  exports: [SignupComponent],
})
export class SignupModule {}
