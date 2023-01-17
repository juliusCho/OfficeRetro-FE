import { NgModule } from '@angular/core'
import { ButtonModule } from 'src/app/components/shared/button/button.module'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { TextModule } from 'src/app/components/shared/text/text.module'
import { AboutRouterModule } from './about-routing.module'
import { AboutComponent } from './about.component'

@NgModule({
  declarations: [AboutComponent],
  imports: [AboutRouterModule, CenterTitleComponent, TextModule, ButtonModule],
  exports: [AboutComponent],
})
export class AboutModule {}
