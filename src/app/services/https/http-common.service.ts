import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, of, retry, shareReplay, take } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable()
export class HttpCommonService {
  private readonly _httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  // Testing purpose
  get httpOptions() {
    return this._httpOptions
  }

  get HandleError() {
    return this.handleError
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
      ? this._http[method](`${environment.apiUrl}/${url}`, this._httpOptions)
      : this._http[method](
          `${environment.apiUrl}/${url}`,
          requestBody,
          this._httpOptions,
        )
    ).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      retry(1),
      catchError(this.handleError),
    ) as unknown as Observable<TResponse>
  }

  protected readonly httpRequestStatic = <TResponse>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    requestBody?: unknown,
  ): Observable<TResponse> =>
    this.httpRequest<TResponse>(method, url, requestBody).pipe(take(1))

  protected readonly handleError = (error: HttpErrorResponse) => {
    return of({ errorMessage: error.error.message })
  }
}
