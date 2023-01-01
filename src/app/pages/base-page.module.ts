import { NgModule } from '@angular/core'
import { SharedModule } from '../components/shared/shared.module'
import { BasePageComponent } from './base-page.component'

@NgModule({
  declarations: [BasePageComponent],
  imports: [SharedModule],
  exports: [BasePageComponent],
})
export class BasePageModule {}
