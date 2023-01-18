import { Injectable } from '@angular/core'
import {
  LoginInfo,
  SignupInfo,
} from 'src/app/models/client-specs/auth/auth-specs'
import { HttpResponse } from 'src/app/models/client-specs/shared/http-specs'
import { HttpCommonService } from './http-common.service'

@Injectable()
export class HttpAuthService extends HttpCommonService {
  private readonly _URL_PREFIX = 'auth'

  readonly signUp = (signupInfo: SignupInfo) => {
    return this.httpRequestStatic<HttpResponse<void>>(
      'post',
      `${this._URL_PREFIX}/register`,
      signupInfo,
    )
  }

  readonly login = (loginInfo: LoginInfo) => {
    return this.httpRequestStatic<HttpResponse<void>>(
      'post',
      `${this._URL_PREFIX}/authenticate`,
      loginInfo,
    )
  }
}
