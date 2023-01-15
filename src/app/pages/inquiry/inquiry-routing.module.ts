import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { InquiryListComponent } from './inquiry-list/inquiry-list.component'

const routes: Routes = [{ path: '', component: InquiryListComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryRouterModule {}
