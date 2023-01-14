import { Component } from '@angular/core'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent extends BasePageComponent {
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

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    console.log('onSubmit', formValue)
    this.isPageLoaded = false
    setTimeout(() => {
      this.isPageLoaded = true
    }, 2000)
  }
}
