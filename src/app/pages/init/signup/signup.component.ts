import { ChangeDetectorRef, Component } from '@angular/core'
import { Router } from '@angular/router'
import { CustomValidator } from 'src/app/helpers/custom-form-validator'
import { SignupInfo } from 'src/app/models/client-specs/auth/auth-specs'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { HttpAuthService } from 'src/app/services/https/http-auth.service'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
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
      key: 'firstName',
      label: 'First Name',
      initValue: '',
      inputType: 'text',
      placeholder: 'First(+Middle) Name',
      max: '50',
      required: true,
    },
    {
      key: 'lastName',
      label: 'Last Name',
      initValue: '',
      inputType: 'text',
      placeholder: 'Last(Sir) Name',
      max: '50',
      required: true,
    },
    {
      key: 'password',
      label: 'Password',
      initValue: ['', ''],
      formValidators: [CustomValidator.password],
      inputType: 'password-confirm',
      placeholder: 'combine alphanumeric & special',
      min: '8',
      max: '50',
      required: true,
    },
  ]
  formValue?: SignupInfo
  isFormConfirmed = false

  constructor(
    private readonly _httpService: HttpAuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    if (!this._isSignupInfo(formValue)) return

    this.formValue = formValue

    this._globalService.confirmModal = {
      show: true,
      message: `Would you like to sign up with the email,\n"${formValue.email}"?\n(The confirmation letter will be sent to this email)`,
      buttons: {
        submit: 'Yes',
        cancel: 'No',
      },
      onSubmit: this._onSubmitConfirmed,
      width: 'unit-35',
    }
  }

  private readonly _onSubmitConfirmed = () => {
    if (!this.formValue) {
      this._globalService.toast = { show: true, type: 'alert' }
      return
    }

    this._globalService.isLoading = true

    this._httpService
      .signUp(this.formValue)
      .subscribe(() => {
        this._globalService.toast = {
          show: true,
          type: 'info',
          message: 'Sign Up succeeded',
        }

        this._router.navigateByUrl('login')
      })
      .add(() => {
        this._globalService.isLoading = false
        this._switchIsFormConfirmed()
      })
  }

  private readonly _isSignupInfo = (
    formValue?: Record<string, unknown>,
  ): formValue is SignupInfo => {
    return (
      !!formValue &&
      'email' in formValue &&
      'password' in formValue &&
      'firstName' in formValue &&
      'lastName' in formValue
    )
  }

  private readonly _switchIsFormConfirmed = () => {
    this.isFormConfirmed = true
    this._changeDetectorRef.detectChanges()
    this.isFormConfirmed = false
    this._changeDetectorRef.detectChanges()
  }
}
