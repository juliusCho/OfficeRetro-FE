import { CdkDragDrop } from '@angular/cdk/drag-drop'
import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core'
import { Validators } from '@angular/forms'
import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicListInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { isNumber } from 'src/app/helpers/type-checkers'
import {
  FormInputOption,
  FormListInputOption,
} from 'src/app/models/client-specs/form/form-input-types'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { ICONS } from 'src/app/models/constants/css-constants'
import {
  COLOR_PICKER_DEFAULT_COLOR,
  LIST_INPUT_NEW_ITEM_ALIAS,
} from 'src/app/models/constants/form-constants'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { CssService } from 'src/app/services/shared/css.service'
import { v4 as uuid } from 'uuid'
import { SuperInputComponent } from '../inheritances/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-list-input',
  templateUrl: './list-input.component.html',
  styleUrls: ['./list-input.component.scss'],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListInputComponent
  extends SuperInputComponent<string[]>
  implements OnInit, OnChanges, AfterContentInit
{
  @Input() listInputLabel?: string = ''
  @Input() isFormSubmitted?: boolean = false // To check if the parent form has submitted

  @ViewChild('listSection') listSection!: ElementRef

  optionValues$ = new BehaviorSubject<FormListInputOption[]>([])
  innerFormInputSpecs: FormInputSpec<unknown>[] = []
  innerFormSubmittable = false

  private _optionValuesObservable$ = this.optionValues$.asObservable()
  private _optionValuesSubscription$?: Subscription

  get optionValues() {
    return this.optionValues$.value.sort((a, b) => a.order - b.order)
  }

  get validator() {
    return this.isValidationNeeded
      ? undefined
      : this.formInputSpec?.validMessageGenerator
  }
  get options() {
    return this.formInputSpec?.options
  }
  get optionsFetchUrl() {
    return this.formInputSpec?.optionsFetchUrl
  }

  get upDownIcon() {
    return ICONS.UP_DOWN
  }

  get crossIcon() {
    return ICONS.CROSS
  }

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly cssService: CssService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(cssService, changeDetectorRef)
  }

  ngOnInit(): void {
    this.setFormInputOption()

    if (this.isDisabled) {
      this.form.get(this.name)?.disable()
      return
    }

    this.form.get(this.name)?.enable()

    this.setOptionValueSubscription()
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isFormSubmitted']?.previousValue === undefined) return

    const { previousValue, currentValue } = changes['isFormSubmitted']
    if (previousValue === currentValue || previousValue || !currentValue) return

    this.setOptionValueSubscription()
    this.setInnerFormSubmittable(true)
    this.setInnerFormSubmittable(false)
    this.scrollListToTop()
  }

  ngAfterContentInit(): void {
    this._optionValuesSubscription$ = this._optionValuesObservable$
      .pipe(
        tap((v) => {
          this.showValidationMessage = false
          this.validationMessage = this.validate(
            v.map((option) => option.value),
          )

          this.form?.get(this.name)?.setValue(v.map((option) => option.value))

          this.changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()
    this.scrollListToTop()
  }

  readonly addOption = (formValue: Record<string, unknown>) => {
    if (this.isDisabled || !this.isFormInputOption(formValue)) return

    const newOption = {
      label: formValue.inputText,
      color: formValue.inputColor || COLOR_PICKER_DEFAULT_COLOR,
    }

    const newOptionList = [
      {
        ...newOption,
        value: `${LIST_INPUT_NEW_ITEM_ALIAS}${uuid()}`,
        order: 1,
      },
      ...this.optionValues.map((option) => ({
        ...option,
        order: option.order + 1,
      })),
    ]

    if (!this.isValidToAddOption(newOptionList)) return

    this.setInnerFormSubmittable(true)

    this.optionValues$.next(newOptionList)

    this.onFocusOut()

    this.setInnerFormSubmittable(false)

    this.scrollListToTop()
  }

  readonly deleteOption = (option: FormListInputOption) => {
    if (this.isDisabled) return

    const existingOptions = this.optionValues
      .filter((o) => o.value !== option.value)
      .map((o) => (o.order > option.order ? { ...o, order: o.order - 1 } : o))

    this.optionValues$.next(existingOptions)

    this.onFocusOut()
  }

  readonly changeOrder = (event: CdkDragDrop<FormListInputOption[]>) => {
    const { previousIndex, currentIndex } = event
    if (previousIndex === currentIndex) return

    const target = this.optionValues.find((_, idx) => idx === previousIndex)
    if (!target) return

    let newOptionList: FormListInputOption[] = []

    if (previousIndex - currentIndex < 0) {
      newOptionList = this.optionValues.map((o, idx) =>
        idx > previousIndex && currentIndex >= idx
          ? { ...o, order: o.order - 1 }
          : idx === previousIndex
          ? { ...target, order: currentIndex + 1 }
          : o,
      )
    } else {
      newOptionList = this.optionValues.map((o, idx) =>
        idx < previousIndex && currentIndex <= idx
          ? { ...o, order: o.order + 1 }
          : idx === previousIndex
          ? { ...target, order: currentIndex + 1 }
          : o,
      )
    }

    this.optionValues$.next(newOptionList)
  }

  private readonly setFormInputOption = () => {
    this.innerFormInputSpecs = [
      {
        key: 'input',
        label: this.listInputLabel,
        initValue: ['', ''],
        inputType: 'text-color',
        placeholder: 'Please type-in to add',
        formValidators: [Validators.required, Validators.max(50)],
        disabled: this.isDisabled,
        max: '50',
      },
    ]

    this.changeDetectorRef.detectChanges()
  }

  private readonly isFormInputOption = (
    value: Record<string, unknown>,
  ): value is { inputText: string; inputColor: string } => {
    return 'inputText' in value && 'inputColor' in value
  }

  private readonly setOptionValueSubscription = () => {
    if (this.options && this.options.length > 0) {
      const options = this.setOptionWithNullHandled(this.options)
      this.optionValues$.next(options)
      return
    }

    if (!this.optionsFetchUrl) return

    this.fetchOptions()
  }

  private readonly fetchOptions = () => {
    if (!this.optionsFetchUrl) return

    if (this._optionValuesSubscription$) {
      this._optionValuesSubscription$.unsubscribe()
    }

    this._optionValuesSubscription$ = this._requestService
      .getGeneralFetch(this.optionsFetchUrl)
      .subscribe((data) => {
        const options = this.setOptionWithNullHandled(
          data.map((d) => ({
            ...d,
            label: d.name,
            value: String(d.id),
          })),
        )

        this.optionValues$.next(options)
      })

    this.changeDetectorRef.detectChanges()
  }

  private readonly validate = (value?: string[]) => {
    if (this.isDisabled || !this.isValidationNeeded) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    return getBasicListInputValidationMsg({
      value,
      label: this.label,
      required: this.required,
      min: this.min,
      max: this.max,
    })
  }

  private readonly setOptionWithNullHandled = (
    options: FormInputOption[],
  ): FormListInputOption[] => {
    const filtered = this.limitMaximumOptionValues(options)
    return filtered.map((o, idx) => ({
      ...o,
      color: o.color ?? COLOR_PICKER_DEFAULT_COLOR,
      order: o.order ?? idx + 1,
    }))
  }

  private readonly limitMaximumOptionValues = (options: FormInputOption[]) => {
    if (!this.max || !isNumber(this.max) || Number(this.max) === -1)
      return options

    return options.filter((_, idx) => idx < Number(this.max))
  }

  private readonly setInnerFormSubmittable = (value: boolean) => {
    this.innerFormSubmittable = value
    this.changeDetectorRef.detectChanges()
  }

  private readonly isValidToAddOption = (options: FormInputOption[]) => {
    if (!this.max || !isNumber(this.max) || Number(this.max) === -1) return true
    if (options.length <= Number(this.max)) return true

    this.validationMessage = `${(this.label ?? 'This field').replace(
      /\\n/g,
      ' ',
    )} should not contain more than ${this.max} item(s)`
    this.showValidationMessage = true

    this.changeDetectorRef.markForCheck()

    return false
  }

  private readonly scrollListToTop = () => {
    this.listSection.nativeElement.scrollTop = 0
    this.changeDetectorRef.markForCheck()
  }
}
