import { NgModule } from '@angular/core'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { NotFoundRouterModule } from './not-found-routing.module'
import { NotFoundComponent } from './not-found.component'

@NgModule({
  declarations: [NotFoundComponent],
  imports: [SharedModule, FormModule, NotFoundRouterModule],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
