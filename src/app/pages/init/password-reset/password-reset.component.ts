import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent {
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
    private readonly _authService: HttpAuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
  ) {}

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    if (!this._isEmailInfo(formValue)) {
      this._globalService.topAlert = { show: true, type: 'alert' }
      return
    }

    // this._globalService.isLoading = false

    // this._authService
    //   .signUp(formValue)
    //   .subscribe((response) => {
    //     if (isHttpError(response)) {
    //       this._globalService.topAlert = getTopAlertForHttpError(response)
    //       return
    //     }

    //     this._globalService.topAlert = {
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
      message:
        'Password reset instruction was sent to your email.\nPlease check your email.',
    }
  }

  private readonly _isEmailInfo = (
    formValue: Record<string, unknown>,
  ): formValue is { email: string } => {
    return 'email' in formValue
  }
}
