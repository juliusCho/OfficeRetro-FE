import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ButtonModule } from '../button/button.module'
import { FormModule } from '../form/form.module'
import { TextModule } from '../text/text.module'
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
  imports: [CommonModule, FormModule, TextModule, ButtonModule],
  exports: declarations,
})
export class ModalModule {}
