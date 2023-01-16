import { Component, OnInit } from '@angular/core'
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
    private readonly _authService: HttpAuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    // this._globalService.formModal = {
    //   show: true,
    //   buttons: {
    //     submit: 'YEAH',
    //     cancel: 'NOPE',
    //   },
    //   onSubmit: console.log,
    //   title: 'FORM',
    //   isClearButtonExist: true,
    //   formInputSpecs: [
    //     {
    //       key: 'color',
    //       label: 'Color',
    //       initValue: ['', ''],
    //       inputType: 'text-color',
    //       placeholder: 'aaa',
    //       required: true,
    //       min: '5',
    //       max: '50',
    //       labelPosition: 'top',
    //     },
    //     {
    //       key: 'range',
    //       label: 'Date Range',
    //       initValue: [undefined, undefined],
    //       inputType: 'date-range',
    //       min: moment().add(-7, 'd').format(),
    //       max: moment().add(7, 'd').format(),
    //       required: true,
    //     },
    //     {
    //       key: 'date',
    //       label: 'Date',
    //       initValue: undefined,
    //       inputType: 'date',
    //       min: moment().add(-7, 'd').format(),
    //       max: moment().add(7, 'd').format(),
    //       required: true,
    //       labelPosition: 'top',
    //     },
    //   ],
    //   confirmModal: {
    //     message: 'CONFIRM PLEASE',
    //     buttons: {
    //       submit: 'YES',
    //       cancel: 'NO',
    //     },
    //   },
    // }
  }

  readonly onSubmit = async (formValue: Record<string, unknown>) => {
    if (!this._isLoginInfo(formValue)) {
      this._globalService.topAlert = { show: true, type: 'alert' }
      return
    }

    this._globalService.isLoading = true

    this._authService
      .login(formValue)
      .subscribe({
        next: (response) => {
          if (isHttpError(response)) {
            this._globalService.topAlert = getTopAlertForHttpError(response)
            return
          }

          this._globalService.topAlert = {
            show: true,
            type: 'info',
            message: 'Login succeeded',
          }

          this._router.navigateByUrl('error')
        },
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
