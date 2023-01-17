import { NgModule } from '@angular/core'
import { ButtonModule } from 'src/app/components/shared/button/button.module'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { TextModule } from 'src/app/components/shared/text/text.module'
import { NotFoundRouterModule } from './not-found-routing.module'
import { NotFoundComponent } from './not-found.component'

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    NotFoundRouterModule,
    CenterTitleComponent,
    TextModule,
    ButtonModule,
  ],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
