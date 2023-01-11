import { Component } from '@angular/core'
import { Validators } from '@angular/forms'
import { forbiddenStringValidator } from 'src/app/helpers/form-validators'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent extends BasePageComponent {
  formInputSpecs: FormInputSpec<unknown>[] = [
    {
      key: 'email',
      label: 'Email',
      initValue: '',
      formValidators: [
        Validators.required,
        Validators.min(5),
        Validators.max(50),
        forbiddenStringValidator(/ /g),
      ],
      inputType: 'email',
      placeholder: 'example@domain.com',
      min: '5',
      max: '50',
      required: true,
    },
    {
      key: 'password',
      initValue: ['', ''],
      formValidators: [
        Validators.required,
        Validators.min(8),
        Validators.max(50),
        forbiddenStringValidator(/ /g),
      ],
      inputType: 'password-confirm',
      min: '8',
      max: '50',
      required: true,
    },
  ]

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    console.log('onSubmit', formValue)
    this.isPageLoaded = false
    setTimeout(() => {
      this.isPageLoaded = true
    }, 2000)
  }
}
