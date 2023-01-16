import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ButtonComponent } from '../button/button.component'
import { FormModule } from '../form/form.module'
import { TextComponent } from '../text/text.component'
import { ModalAlertComponent } from './modal-alert/modal-alert.component'
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component'
import { ModalFormComponent } from './modal-form/modal-form.component'
import { ModalComponent } from './modal.component'

export const declarations = [
  ModalComponent,
  ModalAlertComponent,
  ModalConfirmComponent,
  ModalFormComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule, FormModule, TextComponent, ButtonComponent],
  exports: declarations,
})
export class ModalModule {}
