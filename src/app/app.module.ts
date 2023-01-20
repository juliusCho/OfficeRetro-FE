import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LoadingModule } from './components/shared/loading/loading.module'
import { ModalModule } from './components/shared/modal/modal.module'
import { ToastComponent } from './components/shared/toast/toast.component'
import { ApiInterceptor } from './interceptors/api.interceptor'
import { HttpAuthService } from './services/https/http-auth.service'
import { GlobalService } from './services/shared/global.service'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    LoadingModule,
    ToastComponent,
    ModalModule,
  ],
  providers: [
    HttpAuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiInterceptor,
      multi: true,
      deps: [HttpAuthService, GlobalService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
