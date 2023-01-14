import { Component } from '@angular/core'
import * as moment from 'moment'
import { CustomValidator } from 'src/app/helpers/custom-form-validator'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { COLOR_PICKER_DEFAULT_COLOR } from 'src/app/models/constants/form-constants'
import { BasePageComponent } from '../base-page.component'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export default class LoginComponent extends BasePageComponent {
  formInputSpecs: FormInputSpec<unknown>[] = [
    {
      key: 'list',
      label: 'FILLIN',
      listInputLabel: 'LIST',
      labelPosition: 'top',
      initValue: [
        {
          value: '1',
          label: 'hey',
          color: COLOR_PICKER_DEFAULT_COLOR,
          order: 1,
        },
        {
          value: '2',
          label: 'hello',
          color: COLOR_PICKER_DEFAULT_COLOR,
          order: 2,
        },
        {
          value: '3',
          label: 'hhhh',
          color: COLOR_PICKER_DEFAULT_COLOR,
          order: 3,
        },
        {
          value: '4',
          label: 'hola',
          color: COLOR_PICKER_DEFAULT_COLOR,
          order: 4,
        },
        {
          value: '5',
          label: 'halo',
          color: COLOR_PICKER_DEFAULT_COLOR,
          order: 5,
        },
      ],
      inputType: 'list',
      placeholder: 'PPPPPPPP',
      formValidators: [CustomValidator.listMin(6), CustomValidator.listMax(7)],
      min: '6',
      max: '7',
      required: true,
      height: 'unit-30',
    },
    {
      key: 'color',
      label: 'Color',
      initValue: ['', ''],
      inputType: 'text-color',
      placeholder: 'aaa',
      required: true,
      min: '5',
      max: '50',
      labelPosition: 'top',
    },
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
    {
      key: 'area',
      label: 'Area',
      initValue: '',
      inputType: 'textarea',
      placeholder: 'AWEGAWEG@#',
      max: '5000',
    },
    {
      key: 'drop',
      label: 'Dropdown',
      initValue: '',
      inputType: 'select',
      placeholder: 'Select',
      required: true,
      labelPosition: 'top',
      options: [
        { value: '1', label: 'hey' },
        { value: '2', label: 'hello' },
        { value: '3', label: 'hhhh' },
        { value: '4', label: 'hola' },
        { value: '5', label: 'halo' },
      ],
    },
    {
      key: 'radio',
      label: 'Radio',
      initValue: '',
      inputType: 'radio',
      placeholder: 'Must Select',
      required: true,
      options: [
        { value: '1', label: 'hey' },
        { value: '2', label: 'hello' },
        { value: '3', label: 'hhhh' },
        { value: '4', label: 'hola' },
        { value: '5', label: 'halo' },
      ],
      columnCount: 2,
    },
    {
      key: 'check',
      label: 'Check',
      initValue: [],
      inputType: 'checkbox',
      max: '2',
      required: true,
      options: [
        { value: '1', label: 'hey' },
        { value: '2', label: 'hello' },
        { value: '3', label: 'hhhh' },
        { value: '4', label: 'hola' },
        { value: '5', label: 'halo' },
      ],
      columnCount: 3,
    },
    {
      key: 'range',
      label: 'Date Range',
      initValue: [undefined, undefined],
      inputType: 'date-range',
      min: moment().add(-7, 'd').format(),
      max: moment().add(7, 'd').format(),
      required: true,
    },
    {
      key: 'date',
      label: 'Date',
      initValue: undefined,
      inputType: 'date',
      min: moment().add(-7, 'd').format(),
      max: moment().add(7, 'd').format(),
      required: true,
      labelPosition: 'top',
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
