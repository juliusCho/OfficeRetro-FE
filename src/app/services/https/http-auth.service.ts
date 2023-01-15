import { Injectable } from '@angular/core'
import { HttpResponse } from 'src/app/models/client-specs/shared/http-specs'
import { HttpCommonService } from './http-common.service'

@Injectable()
export class HttpAuthService extends HttpCommonService {
  private readonly _baseUrl = 'auth'

  readonly signUp = (signupInfo: { email: string; password: string }) => {
    return this.httpRequestStatic<HttpResponse<void>>(
      'post',
      `${this._baseUrl}/register`,
      signupInfo,
    )
  }

  readonly login = (loginInfo: { email: string; password: string }) => {
    return this.httpRequestStatic<HttpResponse<void>>(
      'post',
      `${this._baseUrl}/authenticate`,
      loginInfo,
    )
  }
}
