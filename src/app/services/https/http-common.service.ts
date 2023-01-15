import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import {
  catchError,
  Observable,
  of,
  retry,
  shareReplay,
  take,
  timer,
} from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable()
export class HttpCommonService {
  private readonly _HTTP_OPTIONS = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  // Testing purpose
  get httpOptions() {
    return this._HTTP_OPTIONS
  }

  get HandleError() {
    return this._handleError
  }

  constructor(protected readonly _http: HttpClient) {}

  readonly getGeneralFetch = (url: string) => {
    return this.httpRequest<
      Array<{ id: number; name: string; [key: string]: unknown }>
    >('get', `${environment.apiUrl}/${url}`)
  }

  protected readonly httpRequest = <TResponse>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    requestBody?: unknown,
  ): Observable<TResponse> => {
    return (method === 'get' || method === 'delete'
      ? this._http[method](`${environment.apiUrl}/${url}`, this._HTTP_OPTIONS)
      : this._http[method](
          `${environment.apiUrl}/${url}`,
          requestBody,
          this._HTTP_OPTIONS,
        )
    ).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      retry({ count: 1, delay: this._handleRetry }),
      catchError(this._handleError),
    ) as unknown as Observable<TResponse>
  }

  protected readonly httpRequestStatic = <TResponse>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    requestBody?: unknown,
  ): Observable<TResponse> =>
    this.httpRequest<TResponse>(method, url, requestBody).pipe(take(1))

  private readonly _handleRetry = (error: HttpErrorResponse) => {
    if (error.status >= 500) {
      return timer(1000)
    }
    throw error
  }

  protected readonly _handleError = (error: HttpErrorResponse) => {
    return of({ errorMessage: error.error.message })
  }
}
