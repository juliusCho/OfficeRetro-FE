import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CenterTitleComponent } from './center-title/center-title.component'
import { FormModule } from './form/form.module'
import { LoadingComponent } from './loading/loading.component'
import { AlertTextComponent } from './text/alert-text/alert-text.component'
import { InfoTextComponent } from './text/info-text/info-text.component'
import { LinkTextComponent } from './text/link-text/link-text.component'

export const declarations = [
  CenterTitleComponent,
  LoadingComponent,
  InfoTextComponent,
  LinkTextComponent,
  AlertTextComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule, ReactiveFormsModule, FormModule, HttpClientModule],
  exports: declarations,
})
export class SharedModule {}
