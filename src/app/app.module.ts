import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoadingComponent } from './components/shared/loading/loading.component'
import { ModalAlertComponent } from './components/shared/modal/modal-alert/modal-alert.component'
import { ModalConfirmComponent } from './components/shared/modal/modal-confirm/modal-confirm.component'
import { ModalFormComponent } from './components/shared/modal/modal-form/modal-form.component'
import { TopAlertComponent } from './components/shared/top-alert/top-alert.component'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoadingComponent,
    TopAlertComponent,
    ModalAlertComponent,
    ModalConfirmComponent,
    ModalFormComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
