import { Injectable } from '@angular/core'
import {
  LoginInfo,
  SignupInfo,
  TokenInfo,
} from 'src/app/models/client-specs/auth/auth-specs'
import { HttpCommonService } from './http-common.service'

@Injectable()
export class HttpAuthService extends HttpCommonService {
  private readonly _URL_PREFIX = 'auth'

  readonly signUp = (signupInfo: SignupInfo) => {
    return this.httpRequestStatic<void>(
      'post',
      `${this._URL_PREFIX}/register`,
      signupInfo,
    )
  }

  readonly login = (loginInfo: LoginInfo) => {
    return this.httpRequestStatic<TokenInfo>(
      'post',
      `${this._URL_PREFIX}/authenticate`,
      loginInfo,
    )
  }

  readonly refreshToken = (tokenInfo: TokenInfo) => {
    return this.httpRequestStatic<TokenInfo>(
      'post',
      `${this._URL_PREFIX}/refresh`,
      tokenInfo,
    )
  }
}
