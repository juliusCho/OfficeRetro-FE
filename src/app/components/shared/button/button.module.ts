import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BackButtonComponent } from './back-button/back-button.component'
import { ButtonComponent } from './button.component'
import { PlusButtonComponent } from './plus-button/plus-button.component'
import { SearchButtonComponent } from './search-button/search-button.component'

export const declarations = [
  ButtonComponent,
  PlusButtonComponent,
  BackButtonComponent,
  SearchButtonComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule],
  exports: declarations,
})
export class ButtonModule {}
