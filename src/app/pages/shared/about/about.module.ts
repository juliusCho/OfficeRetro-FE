import { NgModule } from '@angular/core'
import { BackButtonComponent } from 'src/app/components/shared/button/back-button/back-button.component'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { TextComponent } from 'src/app/components/shared/text/text.component'
import { AboutRouterModule } from './about-routing.module'
import { AboutComponent } from './about.component'

@NgModule({
  declarations: [AboutComponent],
  imports: [
    AboutRouterModule,
    CenterTitleComponent,
    TextComponent,
    BackButtonComponent,
  ],
  exports: [AboutComponent],
})
export class AboutModule {}
