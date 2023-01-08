import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { catchError, Observable, retry, shareReplay, throwError } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable()
export class HttpCommonService {
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  }

  // Testing purpose
  get HttpOptions() {
    return this.httpOptions
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
      ? this._http[method](url, this.httpOptions)
      : this._http[method](url, requestBody, this.httpOptions)
    ).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
      retry(1),
      catchError(this.handleError),
    ) as unknown as Observable<TResponse>
  }

  protected readonly handleError = (error: any) => {
    let errorMessage = ''

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`
    }

    alert(errorMessage)

    return throwError(() => {
      return errorMessage
    })
  }
}
