import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { BehaviorSubject, debounceTime, tap } from 'rxjs'
import { isArray } from 'src/app/helpers/type-checkers'
import { InputUnderneathDisplay } from 'src/app/models/client-specs/form/form-input-types'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import {
  ButtonColor,
  CssSize,
  FontWeight,
} from 'src/app/models/client-specs/shared/css-specs'
import { FormService } from 'src/app/services/form/form.service'
import { CssService } from 'src/app/services/shared/css.service'

@Component({
  selector: 'app-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFormComponent
  implements OnInit, OnChanges, AfterContentInit, AfterViewInit
{
  @Input() formInputSpecs!: Array<
    FormInputSpec<unknown> | [FormInputSpec<unknown>, FormInputSpec<unknown>]
  >
  @Input() isValidationNeeded?: boolean = false // no input validation checks
  @Input() isConfirmed?: boolean = true // to check if parent component's submit action needs to be listened to
  @Input() buttonArea?: {
    position?: 'bottom' | 'right'
    width?: CssSize
    submitButton?: { label: string; color: ButtonColor }
    cancelButton?: { label: string; color: ButtonColor }
    clearButton?: { label: string; color: ButtonColor }
  }
  @Input() width?: CssSize | string
  @Input() labelArea?: {
    width?: CssSize // label width per each input
    labelSize?: CssSize
    labelWeight?: FontWeight
  }
  @Input() infoTextType?: InputUnderneathDisplay = 'none' // text display underneath the input
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right' // if length text displays, it's position

  @Output() submit = new EventEmitter<Record<string, unknown>>()
  @Output() cancel = new EventEmitter<void>()

  @ViewChild('submitInjectTag') submitInjectTag!: ElementRef

  showValidationMessage = false
  isFormSubmitted = false

  get form() {
    return this._formService.form
  }

  get doesWidthLayoutAdjust() {
    return (
      this.buttonArea?.position !== 'right' ||
      !this._cssService.getSize(this.buttonArea?.width)
    )
  }

  get inputSectionStyle() {
    return this.doesWidthLayoutAdjust
      ? {}
      : {
          width: `calc(100% - ${this._cssService.getSize(
            this.buttonArea?.width,
          )})`,
        }
  }

  get buttonSectionStyle() {
    return this.doesWidthLayoutAdjust
      ? {}
      : { width: this._cssService.getSize(this.buttonArea?.width) }
  }

  get labelStyle() {
    return this.labelArea
      ? {
          labelSize: this.labelArea.labelSize,
          labelWeight: this.labelArea.labelWeight,
        }
      : {}
  }

  get extraStyle() {
    return {
      width: this._cssService.getUntypedSize(this.width),
      'button-side': this.buttonArea?.position === 'right',
    }
  }

  constructor(
    private readonly _cssService: CssService,
    private readonly _formService: FormService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._formService.initialize(this.formInputSpecs)

    this._changeDetectorRef.detectChanges()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isConfirmed']?.previousValue === undefined) return

    const { previousValue, currentValue } = changes['isConfirmed']
    if (previousValue === currentValue || previousValue || !currentValue) return

    if (this._formService.form.invalid) return

    this._formService.reinitializeData()

    this.setIsFormSubmitted(true)
    this.setIsFormSubmitted(false)
  }

  ngAfterContentInit(): void {
    this._formService.bindToValueChanges()
  }

  ngAfterViewInit(): void {
    if (
      this.submitInjectTag.nativeElement.children.length > 0 ||
      this.buttonArea?.submitButton
    ) {
      this._formService.subscribeValueChanges()
      this._changeDetectorRef.markForCheck()
      return
    }

    this._formService.formValueChange$ =
      this._formService.formValueChange$.pipe(
        debounceTime(1000),
        tap(() => {
          this.submitAction()
          this._changeDetectorRef.detectChanges()
        }),
      )

    this._formService.subscribeValueChanges()
    this._changeDetectorRef.markForCheck()
  }

  readonly isSpecArray = (
    formInputSpec:
      | FormInputSpec<unknown>
      | [FormInputSpec<unknown>, FormInputSpec<unknown>],
  ) => {
    return isArray(formInputSpec)
  }

  readonly isFormSpec = (
    formInputSpec: unknown,
  ): formInputSpec is FormInputSpec<unknown> => {
    if (!formInputSpec || typeof formInputSpec !== 'object') return false

    return (
      'key' in formInputSpec &&
      'iniValue' in formInputSpec &&
      'inputType' in formInputSpec
    )
  }

  readonly getValueObservableString = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<string>
  }

  readonly getValueObservableNumber = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<number>
  }

  readonly getValueObservableBoolean = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<boolean>
  }

  readonly getValueObservableArray = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<
      string[]
    >
  }

  readonly getValueObservableStringOrUndefined = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<
      string | undefined
    >
  }

  readonly getValueObservableDateRange = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<
      [string | undefined, string | undefined]
    >
  }

  readonly getValueObservableStringPair = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<
      [string, string]
    >
  }

  readonly getFormInputSpec = <T>(
    formInputSpec: FormInputSpec<T>,
    labelPosition?: 'top' | 'side',
  ) => {
    if (!labelPosition) return formInputSpec
    return { ...formInputSpec, labelPosition }
  }

  readonly getArrayFormInputSpecLabelPosition = (
    inputSpecIdx: number,
    formInputSpecs: [FormInputSpec<unknown>, FormInputSpec<unknown>],
  ) => {
    return inputSpecIdx === 0
      ? formInputSpecs[0].labelPosition ?? formInputSpecs[1].labelPosition
      : undefined
  }

  readonly onSubmit = () => {
    this.submitAction()

    if (this.isConfirmed && this._formService.form.valid) {
      this._formService.reinitializeData()

      this.setIsFormSubmitted(true)
      this.setIsFormSubmitted(false)
    }
  }

  readonly onCancel = () => {
    this._formService.reinitializeData()

    this.cancel.emit()
  }

  readonly onClear = () => {
    this._formService.reinitializeData()
  }

  private readonly submitAction = () => {
    this.showValidationMessage = false
    this._changeDetectorRef.detectChanges()

    if (this._formService.form.invalid) {
      if (
        this.formInputSpecs.some((fis) => !isArray(fis) && fis.key === 'input')
      ) {
        console.log('child form invalid', this.form)
      } else {
        console.log('form invalid', this.form)
      }

      setTimeout(() => {
        this.showValidationMessage = true
        this._changeDetectorRef.detectChanges()
      }, 10)
      return
    }

    this.submit.emit(this._formService.form.value)
  }

  private readonly setIsFormSubmitted = (value: boolean) => {
    this.isFormSubmitted = value
    this._changeDetectorRef.detectChanges()
  }
}
