import {
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
import { debounceTime, tap } from 'rxjs'
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
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFormComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() formInputSpecs!: Array<
    FormInputSpec<unknown> | [FormInputSpec<unknown>, FormInputSpec<unknown>]
  >
  @Input() isValidationDisplaying?: boolean = false // no input validation checks
  @Input() isConfirmed?: boolean = true // to check if parent component's submit action needs to be listened to
  @Input() buttonArea?: {
    position?: 'bottom' | 'right'
    width?: CssSize
    submitButton?: { label: string; color?: ButtonColor }
    cancelButton?: { label: string; color?: ButtonColor }
    clearButton?: { label: string; color?: ButtonColor }
  }
  @Input() width?: CssSize | string
  @Input() labelArea?: {
    width?: CssSize // label width per each input
    labelSize?: CssSize
    labelWeight?: FontWeight
  }
  @Input() infoTextType?: InputUnderneathDisplay = 'none' // text display underneath the input
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right' // if length text displays, it's position

  @Output() submitAction = new EventEmitter<Record<string, unknown>>()
  @Output() cancelAction = new EventEmitter<void>()

  @ViewChild('submitInjectTag') _submitInjectTag!: ElementRef

  isFormSubmitted = false // for list-input component's form to be re-initialized

  get form() {
    return this._formService.form
  }

  get inputSectionStyle() {
    return this._doesWidthLayoutAdjust
      ? {}
      : {
          width: `calc(100% - ${this._cssService.getSize(
            this.buttonArea?.width,
          )})`,
        }
  }

  get buttonSectionStyle() {
    return this._doesWidthLayoutAdjust
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

  get submitButtonStyle() {
    return { 'margin-right': this._cssService.getSize('unit-9') ?? '' }
  }

  get _doesWidthLayoutAdjust() {
    return (
      this.buttonArea?.position !== 'right' ||
      !this._cssService.getSize(this.buttonArea?.width)
    )
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

    if (this.form.invalid) return

    this._formService.reinitializeData()

    this._setIsFormSubmitted(true)
    this._setIsFormSubmitted(false)
  }

  ngAfterViewInit(): void {
    if (
      this._submitInjectTag.nativeElement.children.length > 0 ||
      this.buttonArea?.submitButton
    ) {
      return
    }

    this._formService.formValueChange$ =
      this._formService.formValueChange$.pipe(
        debounceTime(1000),
        tap(() => {
          this._submitProceed()
        }),
      )

    this._formService.subscribeValueChange()

    this._changeDetectorRef.detectChanges()
  }

  readonly isSpecArray = (
    formInputSpec:
      | FormInputSpec<unknown>
      | [FormInputSpec<unknown>, FormInputSpec<unknown>],
  ) => {
    return isArray(formInputSpec)
  }

  readonly getArrayFormInputSpecLabelPosition = (
    inputSpecIdx: number,
    formInputSpecs: [FormInputSpec<unknown>, FormInputSpec<unknown>],
  ) => {
    return inputSpecIdx === 0
      ? formInputSpecs[0].labelPosition ?? formInputSpecs[1].labelPosition
      : undefined
  }

  readonly getInputParams = <T>(
    formInputSpec: FormInputSpec<T>,
    typeInferrer: T,
  ) => {
    return this.getInputParamsWithOrTypes(
      formInputSpec,
      typeInferrer,
      typeInferrer,
    )
  }

  readonly getInputParamsArrayWithOrTypes = <T, T2>(
    formInputSpec: FormInputSpec<[T | T2, T | T2]>,
    typeInferrer1: T,
    typeInferrer2: T2,
  ) => {
    const arr: [T | T2, T | T2] = [typeInferrer1, typeInferrer2]
    return this.getInputParams(formInputSpec, arr)
  }

  readonly getInputParamsWithOrTypes = <T, T2>(
    formInputSpec: FormInputSpec<T | T2>,
    _: T,
    __: T2,
  ) => {
    return {
      form: this.form,
      labelArea: this.labelArea,
      isValidationDisplaying: this.isValidationDisplaying,
      formInputSpec,
      infoTextType: this.infoTextType,
    }
  }

  readonly onSubmit = () => {
    this._submitProceed()

    if (!this.isConfirmed || this.form.invalid) return

    this._formService.reinitializeData()

    this._setIsFormSubmitted(true)
    this._setIsFormSubmitted(false)
  }

  readonly onCancel = () => {
    this._formService.reinitializeData()

    this.cancelAction.emit()
  }

  readonly onClear = () => {
    this._formService.reinitializeData()
  }

  private readonly _submitProceed = () => {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.markAsDirty()
    })

    this.form.markAllAsTouched()

    if (this.form.invalid) return

    this.submitAction.emit(this.form.value)
  }

  private readonly _setIsFormSubmitted = (value: boolean) => {
    this.isFormSubmitted = value
    this._changeDetectorRef.detectChanges()
  }
}
