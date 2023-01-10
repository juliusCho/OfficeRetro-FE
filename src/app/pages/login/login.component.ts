import { Component } from '@angular/core'
import { Validators } from '@angular/forms'
import { forbiddenStringValidator } from 'src/app/helpers/form-validators'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
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
    // {
    //   key: 'list',
    //   label: 'FILLIN',
    //   listInputLabel: 'LIST',
    //   labelPosition: 'top',
    //   initValue: [],
    //   inputType: 'list',
    //   placeholder: 'PPPPPPPP',
    //   formValidators: [
    //     listMinimumSelectValidator(6),
    //     listMaximumSelectValidator(7),
    //   ],
    //   min: '6',
    //   max: '7',
    //   required: true,
    //   options: [
    //     { value: '1', label: 'hey', color: COLOR_PICKER_DEFAULT_COLOR },
    //     { value: '2', label: 'hello', color: COLOR_PICKER_DEFAULT_COLOR },
    //     { value: '3', label: 'hhhh', color: COLOR_PICKER_DEFAULT_COLOR },
    //     { value: '4', label: 'hola', color: COLOR_PICKER_DEFAULT_COLOR },
    //     { value: '5', label: 'halo', color: COLOR_PICKER_DEFAULT_COLOR },
    //   ],
    //   height: 'unit-30',
    // },
    // {
    //   key: 'color',
    //   label: 'Color',
    //   initValue: ['', ''],
    //   inputType: 'text-color',
    //   placeholder: 'aaa',
    //   formValidators: [Validators.required],
    //   required: true,
    //   min: '5',
    //   max: '50',
    //   labelPosition: 'top',
    // },
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
      label: 'Password',
      initValue: '',
      formValidators: [
        Validators.required,
        Validators.min(8),
        Validators.max(50),
        forbiddenStringValidator(/ /g),
      ],
      inputType: 'password-login',
      min: '8',
      max: '50',
      required: true,
    },
    // {
    //   key: 'area',
    //   label: 'Area',
    //   initValue: '',
    //   formValidators: [Validators.max(5000)],
    //   inputType: 'textarea',
    //   placeholder: 'AWEGAWEG@#',
    //   max: '5000',
    // },
    // {
    //   key: 'drop',
    //   label: 'Dropdown',
    //   initValue: '',
    //   formValidators: [Validators.required],
    //   inputType: 'select',
    //   placeholder: 'Select',
    //   required: true,
    //   labelPosition: 'top',
    //   options: [
    //     { value: '1', label: 'hey' },
    //     { value: '2', label: 'hello' },
    //     { value: '3', label: 'hhhh' },
    //     { value: '4', label: 'hola' },
    //     { value: '5', label: 'halo' },
    //   ],
    // },
    // {
    //   key: 'radio',
    //   label: 'Radio',
    //   initValue: '',
    //   formValidators: [Validators.required],
    //   inputType: 'radio',
    //   placeholder: 'Must Select',
    //   required: true,
    //   options: [
    //     { value: '1', label: 'hey' },
    //     { value: '2', label: 'hello' },
    //     { value: '3', label: 'hhhh' },
    //     { value: '4', label: 'hola' },
    //     { value: '5', label: 'halo' },
    //   ],
    //   columnCount: 2,
    // },
    // {
    //   key: 'check',
    //   label: 'Check',
    //   initValue: [],
    //   formValidators: [
    //     listMinimumSelectValidator(1),
    //     listMaximumSelectValidator(2),
    //   ],
    //   inputType: 'checkbox',
    //   max: '2',
    //   required: true,
    //   options: [
    //     { value: '1', label: 'hey' },
    //     { value: '2', label: 'hello' },
    //     { value: '3', label: 'hhhh' },
    //     { value: '4', label: 'hola' },
    //     { value: '5', label: 'halo' },
    //   ],
    //   columnCount: 3,
    // },
    // {
    //   key: 'range',
    //   label: 'Date Range',
    //   initValue: [undefined, undefined],
    //   inputType: 'date-range',
    //   formValidators: [
    //     [
    //       Validators.required,
    //       dateMinimumValidator(moment().add(-7, 'd')),
    //       dateMaximumValidator(moment().add(7, 'd')),
    //     ],
    //     [
    //       Validators.required,
    //       dateMinimumValidator(moment().add(-7, 'd')),
    //       dateMaximumValidator(moment().add(7, 'd')),
    //     ],
    //   ],
    //   min: moment().add(-7, 'd').format(),
    //   max: moment().add(7, 'd').format(),
    //   required: true,
    // },
    // {
    //   key: 'date',
    //   label: 'Date',
    //   initValue: undefined,
    //   inputType: 'date',
    //   formValidators: [
    //     Validators.required,
    //     dateMinimumValidator(moment().add(-7, 'd')),
    //     dateMaximumValidator(moment().add(7, 'd')),
    //   ],
    //   min: moment().add(-7, 'd').format(),
    //   max: moment().add(7, 'd').format(),
    //   required: true,
    //   labelPosition: 'top',
    // },
  ]

  readonly onSubmit = (formValue: Record<string, unknown>) => {
    console.log('onSubmit', formValue)
    this.isPageLoaded = false
    setTimeout(() => {
      this.isPageLoaded = true
    }, 2000)
  }
}
