import { NgModule } from '@angular/core'
import { BackButtonComponent } from 'src/app/components/shared/button/back-button/back-button.component'
import { CenterTitleComponent } from 'src/app/components/shared/center-title/center-title.component'
import { TextComponent } from 'src/app/components/shared/text/text.component'
import { ErrorRouterModule } from './error-routing.module'
import { ErrorComponent } from './error.component'

@NgModule({
  declarations: [ErrorComponent],
  imports: [
    ErrorRouterModule,
    CenterTitleComponent,
    TextComponent,
    BackButtonComponent,
  ],
  exports: [ErrorComponent],
})
export class ErrorModule {}
