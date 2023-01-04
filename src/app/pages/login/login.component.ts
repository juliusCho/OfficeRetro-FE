import { AfterContentInit, Component } from '@angular/core'
import { Validators } from '@angular/forms'
import { forbiddenStringValidator } from 'src/app/helpers/form-validators'
import { isString } from 'src/app/helpers/type-checkers'
import { FormSpec } from 'src/app/models/client-specs/form/form-spec'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent
  extends BasePageComponent
  implements AfterContentInit
{
  formSpecs: FormSpec<unknown>[] = [
    {
      key: 'email',
      label: 'Email',
      initValue: '',
      formValidators: [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
        forbiddenStringValidator(/ /g),
      ],
      validMessageGenerator: (value?: unknown) => {
        if (!value) return ''
        if (!isString(value)) return ''

        if (/ /g.test(value)) {
          return 'Email should not contain blank space'
        }

        if (
          !value
            .toLowerCase()
            .match(
              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            )
        ) {
          return 'Invalid email format'
        }

        return ''
      },
      inputType: 'email',
      infoTextType: 'all',
      placeholder: 'example@domain.com',
      minLength: 5,
      maxLength: 50,
      required: true,
    },
    {
      key: 'password',
      label: 'Password',
      initValue: '',
      formValidators: [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(50),
        forbiddenStringValidator(/ /g),
      ],
      inputType: 'password',
      infoTextType: 'all',
      placeholder: 'Password',
      minLength: 8,
      maxLength: 50,
      required: true,
    },
    {
      key: 'area',
      label: 'Area',
      initValue: '',
      formValidators: [Validators.maxLength(5000)],
      inputType: 'textarea',
      infoTextType: 'all',
      placeholder: 'AWEGAWEG@#',
      maxLength: 5000,
    },
    {
      key: 'drop',
      label: 'Dropdown',
      initValue: '',
      formValidators: [Validators.required],
      inputType: 'select',
      infoTextType: 'all',
      placeholder: 'Select',
      required: true,
      options: [
        { '1': 'hey' },
        { '2': 'hello' },
        { '3': 'hhhh' },
        { '4': 'hola' },
        { '5': 'halo' },
      ],
    },
    {
      key: 'radio',
      label: 'Radio',
      initValue: '',
      formValidators: [Validators.required],
      inputType: 'radio',
      infoTextType: 'all',
      placeholder: 'Must Select',
      required: true,
      options: [
        { '1': 'hey' },
        { '2': 'hello' },
        { '3': 'hhhh' },
        { '4': 'hola' },
        { '5': 'halo' },
      ],
      columnCount: 2,
    },
    {
      key: 'check',
      label: 'Check',
      initValue: '',
      formValidators: [Validators.required, Validators.maxLength(2)],
      inputType: 'checkbox',
      infoTextType: 'all',
      maxLength: 2,
      required: true,
      options: [
        { '1': 'hey' },
        { '2': 'hello' },
        { '3': 'hhhh' },
        { '4': 'hola' },
        { '5': 'halo' },
      ],
      columnCount: 3,
    },
  ]

  ngAfterContentInit(): void {
    this.isPageLoaded = true
  }

  readonly onSubmit = () => {
    this.isLoading = true
    setTimeout(() => {
      this.isLoading = false
    }, 2000)
  }
}
