import { NgModule } from '@angular/core'
import { ButtonModule } from 'src/app/components/shared/button/button.module'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { TextModule } from 'src/app/components/shared/text/text.module'
import { ErrorRouterModule } from './error-routing.module'
import { ErrorComponent } from './error.component'

@NgModule({
  declarations: [ErrorComponent],
  imports: [ErrorRouterModule, CenterTitleComponent, TextModule, ButtonModule],
  exports: [ErrorComponent],
})
export class ErrorModule {}
