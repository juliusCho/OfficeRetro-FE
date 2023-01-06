import { Component } from '@angular/core'
import { Validators } from '@angular/forms'
import * as moment from 'moment'
import { forbiddenStringValidator } from 'src/app/helpers/form-validators'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { CssService } from 'src/app/services/shared/css.service'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent extends BasePageComponent {
  layoutPlay = false

  formInputSpecs: Array<
    FormInputSpec<unknown> | [FormInputSpec<unknown>, FormInputSpec<unknown>]
  > = [
    [
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
        label: 'Pass\nword',
        initValue: '',
        formValidators: [
          Validators.required,
          Validators.min(8),
          Validators.max(50),
          forbiddenStringValidator(/ /g),
        ],
        inputType: 'password-login',
        placeholder: 'Password',
        min: '8',
        max: '50',
        required: true,
      },
    ],
    {
      key: 'area',
      label: 'Area',
      initValue: '',
      formValidators: [Validators.max(5000)],
      inputType: 'textarea',
      placeholder: 'AWEGAWEG@#',
      max: '5000',
    },
    {
      key: 'drop',
      label: 'Dropdown',
      initValue: '',
      formValidators: [Validators.required],
      inputType: 'select',
      placeholder: 'Select',
      required: true,
      labelPosition: 'top',
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
      formValidators: [Validators.required, Validators.max(2)],
      inputType: 'checkbox',
      max: '2',
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
    {
      key: 'range',
      label: 'Date Range',
      initValue: [undefined, undefined],
      inputType: 'date-range',
      formValidators: [[Validators.required], [Validators.required]],
      min: moment().add(-7, 'd').format(),
      max: moment().add(7, 'd').format(),
      required: true,
    },
    {
      key: 'date',
      label: 'Date',
      initValue: undefined,
      inputType: 'date',
      formValidators: [Validators.required],
      min: moment().add(-7, 'd').format(),
      max: moment().add(7, 'd').format(),
      required: true,
      labelPosition: 'top',
    },
  ]

  constructor(public readonly _cssService: CssService) {
    super()
  }

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    console.log('onSubmit', formValue)
    this.isPageLoaded = false
    setTimeout(() => {
      this.isPageLoaded = true
    }, 2000)
  }
}
