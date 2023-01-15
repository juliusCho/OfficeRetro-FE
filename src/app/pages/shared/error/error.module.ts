import { NgModule } from '@angular/core'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { ErrorRouterModule } from './error-routing.module'
import { ErrorComponent } from './error.component'

@NgModule({
  declarations: [ErrorComponent],
  imports: [SharedModule, FormModule, ErrorRouterModule],
  exports: [ErrorComponent],
})
export class ErrorModule {}
