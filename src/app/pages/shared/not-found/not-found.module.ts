import { NgModule } from '@angular/core'
import { ButtonComponent } from 'src/app/components/shared/button/button.component'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { TextComponent } from 'src/app/components/shared/text/text.component'
import { NotFoundRouterModule } from './not-found-routing.module'
import { NotFoundComponent } from './not-found.component'

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    NotFoundRouterModule,
    CenterTitleComponent,
    TextComponent,
    ButtonComponent,
  ],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
