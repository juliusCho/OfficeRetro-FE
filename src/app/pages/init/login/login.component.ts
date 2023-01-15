import { Component } from '@angular/core'
import { Router } from '@angular/router'
import {
  getTopAlertForHttpError,
  isHttpError,
} from 'src/app/helpers/http-helpers'
import { LoginInfo } from 'src/app/models/client-specs/auth/auth-specs'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent {
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
    private readonly _authService: HttpAuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
  ) {}

  readonly onSubmit = async (formValue: Record<string, unknown>) => {
    if (!this.isLoginInfo(formValue)) {
      this._globalService.topAlert = { show: true, type: 'alert' }
      return
    }

    this._globalService.isLoading = false

    this._authService
      .login(formValue)
      .subscribe((response) => {
        if (isHttpError(response)) {
          this._globalService.topAlert = getTopAlertForHttpError(response)
          return
        }

        this._globalService.topAlert = {
          show: true,
          type: 'info',
          message: 'Login succeeded',
        }

        // this._router.navigateByUrl('')
      })
      .add(() => {
        this._globalService.isLoading = true
      })
  }

  private readonly isLoginInfo = (
    formValue: Record<string, unknown>,
  ): formValue is LoginInfo => {
    return 'email' in formValue && 'password' in formValue
  }
}
