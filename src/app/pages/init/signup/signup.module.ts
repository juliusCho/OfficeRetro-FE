import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { SignupRoutingModule } from './signup-routing.module'
import { SignupComponent } from './signup.component'

@NgModule({
  declarations: [SignupComponent],
  imports: [
    SharedModule,
    SignupRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormModule,
  ],
  providers: [HttpAuthService],
  exports: [SignupComponent],
})
export class SignupModule {}
