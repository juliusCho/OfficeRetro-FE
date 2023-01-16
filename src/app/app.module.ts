import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoadingComponent } from './components/shared/loading/loading.component'
import { ModalModule } from './components/shared/modal/modal.module'
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
    ModalModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
