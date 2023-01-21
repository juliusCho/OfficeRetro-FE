import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { catchError, Observable, of, shareReplay, switchMap } from 'rxjs'
import { HttpAuthService } from '../services/https/http-auth.service'
import { AuthService } from '../services/shared/auth.service'
import { GlobalService } from '../services/shared/global.service'

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(
    private readonly _authService: AuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
    private readonly _httpService: HttpAuthService,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this._authService.token

    request = this._getRequest(request, token)

    return next.handle(request).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      catchError((error) => this._handleError(error, request, next)),
    )
  }

  private readonly _getRequest = (
    request: HttpRequest<unknown>,
    token?: string,
  ) => {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  }

  private readonly _handleError = (
    error: HttpErrorResponse,
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ) => {
    if (error.status === 401) {
      return this._handleUnauthorizedRequest(request, next)
    }

    return this._handleErrorAction(error.error.message)
  }

  private readonly _handleErrorAction = (errorMessage: string) => {
    this._globalService.toast = {
      show: true,
      type: 'alert',
      message: errorMessage,
    }

    return of()
  }

  private readonly _handleUnauthorizedRequest = (
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ) => {
    const tokenApi = {
      accessToken: this._authService.token,
      refreshToken: this._authService.refreshToken,
    }

    return this._httpService.refreshToken(tokenApi).pipe(
      switchMap((response) => {
        this._authService.token = response.accessToken
        this._authService.refreshToken = response.refreshToken

        request = this._getRequest(request, response.accessToken)

        return next.handle(request)
      }),
      catchError((error) => {
        this._router.navigateByUrl('login')

        return this._handleErrorAction(error.error.message)
      }),
    )
  }
}
