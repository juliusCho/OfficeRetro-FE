import { Component } from '@angular/core'
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

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    console.log('onSubmit', formValue)
    this.isPageLoaded = false
    setTimeout(() => {
      this.isPageLoaded = true
    }, 2000)
  }
}
