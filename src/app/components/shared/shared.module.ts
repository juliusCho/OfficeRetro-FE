import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { BackButtonComponent } from './button/back-button/back-button.component'
import { CenterTitleComponent } from './center-title/center-title.component'
import { FormModule } from './form/form.module'
import { LoadingComponent } from './loading/loading.component'
import { AlertTextComponent } from './text/alert-text/alert-text.component'
import { InfoTextComponent } from './text/info-text/info-text.component'
import { LinkTextComponent } from './text/link-text/link-text.component'
import { TopAlertComponent } from './top-alert/top-alert.component'

export const declarations = [
  CenterTitleComponent,
  InfoTextComponent,
  LinkTextComponent,
  AlertTextComponent,
  LoadingComponent,
  TopAlertComponent,
  BackButtonComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule, ReactiveFormsModule, FormModule, HttpClientModule],
  exports: declarations,
})
export class SharedModule {}
