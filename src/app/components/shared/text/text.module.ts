import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { AlertTextComponent } from './alert-text/alert-text.component'
import { InfoTextComponent } from './info-text/info-text.component'
import { LinkTextComponent } from './link-text/link-text.component'
import { TextComponent } from './text.component'

export const declarations = [
  TextComponent,
  AlertTextComponent,
  InfoTextComponent,
  LinkTextComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule],
  exports: declarations,
})
export class TextModule {}
