import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  templateUrl: './password-reset-request.component.html',
  styleUrls: ['./password-reset-request.component.scss'],
})
export class PasswordResetRequestComponent {
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
  ]

  constructor(
    private readonly _httpService: HttpAuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
  ) {}

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    if (!this._isEmailInfo(formValue)) {
      this._globalService.toast = { show: true, type: 'alert' }
      return
    }

    // this._globalService.isLoading = false

    // this._httpService
    //   .signUp(formValue)
    //   .subscribe((response) => {
    //     if (isHttpError(response)) {
    //       this._globalService.toast = getTopAlertForHttpError(response)
    //       return
    //     }

    //     this._globalService.toast = {
    //       show: true,
    //       type: 'info',
    //       message: 'Sign Up succeeded',
    //     }

    //     this._router.navigateByUrl('login')
    //   })
    //   .add(() => {
    //     this._globalService.isLoading = true
    //   })

    this._globalService.alertModal = {
      show: true,
      title: 'Instruction was Sent',
      message: `Password reset instruction was sent to the following email:\n"${formValue.email}"`,
    }

    this._router.navigateByUrl('login')
  }

  private readonly _isEmailInfo = (
    formValue: Record<string, unknown>,
  ): formValue is { email: string } => {
    return 'email' in formValue
  }
}
