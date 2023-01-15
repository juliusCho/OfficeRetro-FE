import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { ReactiveFormsModule } from '@angular/forms'
import { FormModule } from 'src/app/components/shared/form/form.module'
import { SharedModule } from 'src/app/components/shared/shared.module'
import { InquiryListComponent } from './inquiry-list/inquiry-list.component'
import { InquiryRouterModule } from './inquiry-routing.module'

export const declarations = [InquiryListComponent]

@NgModule({
  declarations,
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    FormModule,
    InquiryRouterModule,
  ],
  providers: [],
  exports: declarations,
})
export class InquiryModule {}
