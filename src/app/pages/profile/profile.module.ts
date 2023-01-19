import { NgModule } from '@angular/core'
import { ProfileRoutingModule } from './profile-routing.module'
import { ProfileComponent } from './profile.component'

@NgModule({
  declarations: [ProfileComponent],
  imports: [ProfileRoutingModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
