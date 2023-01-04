import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { CentreTitleComponent } from './centre-title/centre-title.component'
import { FormModule } from './form/form.module'
import { LoadingComponent } from './loading/loading.component'

export const declarations = [CentreTitleComponent, LoadingComponent]

@NgModule({
  declarations,
  imports: [CommonModule, ReactiveFormsModule, FormModule, HttpClientModule],
  exports: declarations,
})
export class SharedModule {}
