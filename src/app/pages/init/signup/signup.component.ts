import { Component } from '@angular/core'
import { Router } from '@angular/router'
import {
  getTopAlertForHttpError,
  isHttpError,
} from 'src/app/helpers/http-helpers'
import { SignupInfo } from 'src/app/models/client-specs/auth/auth-specs'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
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
      initValue: ['', ''],
      inputType: 'password-confirm',
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

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    if (!this.isSignupInfo(formValue)) {
      this._globalService.topAlert = { show: true, type: 'alert' }
      return
    }

    this._globalService.isLoading = false

    this._authService
      .signUp(formValue)
      .subscribe((response) => {
        if (isHttpError(response)) {
          this._globalService.topAlert = getTopAlertForHttpError(response)
          return
        }

        this._globalService.topAlert = {
          show: true,
          type: 'info',
          message: 'Sign Up succeeded',
        }

        this._router.navigateByUrl('login')
      })
      .add(() => {
        this._globalService.isLoading = true
      })
  }

  private readonly isSignupInfo = (
    formValue: Record<string, unknown>,
  ): formValue is SignupInfo => {
    return 'email' in formValue && 'password' in formValue
  }
}
