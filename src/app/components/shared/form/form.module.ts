import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormComponent } from './form.component'
import { BaseInputComponent } from './shared/base-input/base-input.component'
import { BaseListInputComponent } from './shared/base-list-input.component.ts/base-list-input.component'
import { BaseSelectComponent } from './shared/base-select.component.ts/base-select.component'
import { SuperInputComponent } from './shared/super-input.component'

const declarations = [
  BaseInputComponent,
  FormComponent,
  BaseSelectComponent,
  BaseListInputComponent,
  SuperInputComponent,
]

@NgModule({
  declarations,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  exports: declarations,
})
export class FormModule {}
