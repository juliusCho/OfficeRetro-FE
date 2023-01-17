import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { PasswordResetRequestComponent } from './password-reset-request.component'

const routes: Routes = [{ path: '', component: PasswordResetRequestComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordResetRequestRouterModule {}
