import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BaseInputComponent } from './base-input.component'

@NgModule({
  declarations: [BaseInputComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [BaseInputComponent],
})
export class BaseInputModule {}
