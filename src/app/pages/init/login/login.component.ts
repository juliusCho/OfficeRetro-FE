import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { LoginInfo } from 'src/app/models/client-specs/auth/auth-specs'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { AuthService } from 'src/app/services/shared/auth.service'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent implements OnInit {
  formInputSpecs: FormInputSpec<unknown>[] = [
    {
      key: 'email',
      label: 'Email',
      initValue: '',
      inputType: 'email',
      placeholder: 'example@domain.com',
      min: '5',
      max: '50',
      required: true,
    },
    {
      key: 'password',
      label: 'Password',
      initValue: '',
      inputType: 'password-login',
      min: '8',
      max: '50',
      required: true,
    },
  ]

  constructor(
    private readonly _httpService: HttpAuthService,
    private readonly _globalService: GlobalService,
    private readonly _authService: AuthService,
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    this._authService.signOut()
  }

  readonly onSubmit = async (formValue: Record<string, unknown>) => {
    if (!this._isLoginInfo(formValue)) {
      this._globalService.toast = { show: true, type: 'alert' }
      return
    }

    this._globalService.isLoading = true

    this._httpService
      .login(formValue)
      .subscribe((response) => {
        this._authService.token = response.accessToken
        this._authService.refreshToken = response.refreshToken

        this._globalService.toast = {
          show: true,
          type: 'info',
          message: 'Login succeeded',
        }

        this._router.navigateByUrl('profiles')
      })
      .add(() => {
        this._globalService.isLoading = false
      })
  }

  private readonly _isLoginInfo = (
    formValue: Record<string, unknown>,
  ): formValue is LoginInfo => {
    return 'email' in formValue && 'password' in formValue
  }
}
