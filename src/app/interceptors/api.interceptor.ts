import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, Observable, of, retry, shareReplay, timer } from 'rxjs'
import { AuthService } from '../services/shared/auth.service'
import { GlobalService } from '../services/shared/global.service'

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private readonly _authService: AuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this._authService.token

    request = request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })

    return next
      .handle(request)
      .pipe(
        shareReplay({ bufferSize: 1, refCount: true }),
        retry({ count: 1, delay: this._handleRetry }),
        catchError(this._handleError),
      )
  }

  private readonly _handleRetry = (error: HttpErrorResponse) => {
    if (error.status >= 500) {
      return timer(1000)
    }

    if (error.status === 401) {
      this._globalService.toast = {
        show: true,
        type: 'alert',
        message: 'Session was expired',
      }

      this._router.navigateByUrl('login')

      return of()
    }

    throw error
  }

  private readonly _handleError = (error: HttpErrorResponse) => {
    this._globalService.toast = {
      show: true,
      type: 'alert',
      message: error.error.message,
    }

    return of()
  }
}
