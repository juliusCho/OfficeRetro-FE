import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { BehaviorSubject, debounceTime, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { isArray } from 'src/app/helpers/type-checkers'
import { InputUnderneathDisplay } from 'src/app/models/client-specs/form/form-input-types'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { FormService } from 'src/app/services/form/form.service'

@AutoUnsubscribe()
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit, AfterContentInit, AfterViewInit {
  @Input() formInputSpecs!: Array<
    FormInputSpec<unknown> | [FormInputSpec<unknown>, FormInputSpec<unknown>]
  >
  @Input() submitLabel?: string
  @Input() submitColor?: string
  @Input() cancelLabel?: string
  @Input() clearLabel?: string
  @Input() width?: string = ''
  @Input() isValidationNeeded?: boolean = false // no input validation checks
  @Input() buttonAreaPosition?: 'bottom' | 'right' = 'bottom'
  @Input() buttonAreaWidth?: string
  @Input() labelWidth?: string // label width per each input
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'
  @Input() infoTextType?: InputUnderneathDisplay = 'none' // text display underneath the input
  @Input() isConfirmed?: boolean = true

  @Output() submit = new EventEmitter<Record<string, unknown>>()
  @Output() cancel = new EventEmitter<void>()

  @ViewChild('submitInjectTag') submitInjectTag!: ElementRef

  showValidationMessage = false

  private _injectedButtonOnClick$?: Subscription

  get form() {
    return this._formService.form
  }

  get doesWidthLayoutAdjust() {
    return this.buttonAreaPosition !== 'right' || !this.buttonAreaWidth
  }

  get inputSectionStyle() {
    return this.doesWidthLayoutAdjust
      ? {}
      : { width: `calc(100% - ${this.buttonAreaWidth})` }
  }

  get buttonSectionStyle() {
    return this.doesWidthLayoutAdjust ? {} : { width: this.buttonAreaWidth }
  }

  constructor(
    private readonly _formService: FormService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._formService.initialize(this.formInputSpecs)
  }

  ngAfterContentInit(): void {
    this._formService.bindToValueChanges()
  }

  ngAfterViewInit(): void {
    if (
      this.submitInjectTag.nativeElement.children.length > 0 ||
      this.submitLabel
    ) {
      this._formService.subscribeValueChanges()
      return
    }

    this._formService.formValueChange$ =
      this._formService.formValueChange$.pipe(
        debounceTime(1000),
        tap(() => {
          this.submitAction()
          this._changeDetectorRef.markForCheck()
        }),
      )

    this._changeDetectorRef.detectChanges()

    this._formService.subscribeValueChanges()
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
    }
  }

  readonly onCancel = () => {
    this.initializeForm()

    this.cancel.emit()
  }

  readonly onClear = () => {
    this.initializeForm()
  }

  private readonly submitAction = () => {
    this.showValidationMessage = false
    this._changeDetectorRef.detectChanges()

    if (this._formService.form.invalid) {
      console.log('form invalid', this.form)
      setTimeout(() => {
        this.showValidationMessage = true
        this._changeDetectorRef.markForCheck()
      }, 10)
      return
    }

    this.submit.emit(this._formService.form.value)
  }

  private readonly initializeForm = () => {
    this._formService.reinitializeData()
    this._changeDetectorRef.detectChanges()
  }
}
