import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { BackButtonComponent } from './back-button/back-button.component'
import { ButtonComponent } from './button.component'
import { PlusButtonComponent } from './plus-button/plus-button.component'

export const declarations = [
  ButtonComponent,
  PlusButtonComponent,
  BackButtonComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule],
  exports: declarations,
})
export class ButtonModule {}
