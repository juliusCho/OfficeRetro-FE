import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { map, Observable, of, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicListInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { convertToColumnizedArray } from 'src/app/helpers/value-converters'
import { FormInputOption } from 'src/app/models/client-specs/form/form-input-types'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { CssService } from 'src/app/services/shared/css.service'
import { v4 as uuid } from 'uuid'
import { SuperInputComponent } from '../shared/base/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: [
    '../../../../styles/templates/select-options-input.component.scss',
  ],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent
  extends SuperInputComponent<string[]>
  implements OnInit
{
  private readonly _componentUniqueId = uuid()
  private _valueChangeSubscription$?: Subscription

  protected optionValues$!: Observable<FormInputOption[]>

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

  get columnCount() {
    return this.formInputSpec?.columnCount ?? 2
  }

  get columnWidth() {
    return `calc(100% / ${this.columnCount})`
  }

  get componentUniqueId() {
    return this._componentUniqueId
  }

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly cssService: CssService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(cssService, changeDetectorRef)
  }

  ngOnInit(): void {
    if (this.isDisabled) {
      this.form.get(this.name)?.disable()
      return
    }

    this.form.get(this.name)?.enable()

    this._valueChangeSubscription$ = this.valueChange$
      .pipe(
        tap((v) => {
          this.showValidationMessage = false
          this.validationMessage = this.validate(v)

          this.changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()

    this.setOptionValueObservable()
  }

  readonly getItems = (optionValues: FormInputOption[]) => {
    return convertToColumnizedArray(optionValues, this.columnCount ?? 0)
  }

  readonly isSelectedOption = (selectedOptions: string[], option: string) => {
    return selectedOptions.includes(option)
  }

  readonly getSelectedOptions = (optionValues: FormInputOption[]) => {
    const selected = this.form.value[this.name]

    return !selected
      ? []
      : optionValues
          .filter((option) => selected.includes(option.value))
          .map((option) => option.value)
  }

  readonly selectOption = (value: string) => {
    if (this.isDisabled) return

    let formValues: string[] = [...(this.form.value[this.name] ?? [])]

    if (formValues.includes(value)) {
      formValues = formValues.filter((v) => v !== value)
    } else {
      formValues.push(value)
    }

    this.form.get(this.name)?.setValue(formValues)

    this.onFocusOut()
  }

  private readonly setOptionValueObservable = () => {
    if (this.options && this.options.length > 0) {
      this.optionValues$ = of(this.options)

      this.changeDetectorRef.detectChanges()
      return
    }

    if (!this.optionsFetchUrl) {
      this.optionValues$ = of([])
      this.changeDetectorRef.detectChanges()
      return
    }

    this.fetchOptions()
  }

  private readonly fetchOptions = () => {
    if (!this.optionsFetchUrl) return

    this.optionValues$ = this._requestService
      .getGeneralFetch(this.optionsFetchUrl)
      .pipe(
        map((data) =>
          data.map((d) => ({
            ...d,
            label: d.name,
            value: String(d.id),
          })),
        ),
      )

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
}
