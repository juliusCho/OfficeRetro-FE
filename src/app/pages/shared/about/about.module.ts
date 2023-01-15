import { NgModule } from '@angular/core'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { AboutRouterModule } from './about-routing.module'
import { AboutComponent } from './about.component'

@NgModule({
  declarations: [AboutComponent],
  imports: [SharedModule, FormModule, AboutRouterModule],
  exports: [AboutComponent],
})
export class AboutModule {}
