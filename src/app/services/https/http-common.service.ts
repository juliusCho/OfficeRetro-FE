import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, take } from 'rxjs'
import { environment } from 'src/environments/environment'

@Injectable()
export class HttpCommonService {
  constructor(protected readonly _http: HttpClient) {}

  readonly getGeneralFetch = (url: string) =>
    this.httpRequest<
      Array<{ id: number; name: string; [key: string]: unknown }>
    >('get', url)

  protected readonly httpRequest = <TResponse>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    requestBody?: unknown,
  ): Observable<TResponse> => {
    return (method === 'get' || method === 'delete'
      ? this._http[method](`${environment.apiUrl}/${url}`)
      : this._http[method](
          `${environment.apiUrl}/${url}`,
          requestBody,
        )) as unknown as Observable<TResponse>
  }

  protected readonly httpRequestStatic = <TResponse>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    requestBody?: unknown,
  ): Observable<TResponse> =>
    this.httpRequest<TResponse>(method, url, requestBody).pipe(take(1))
}
