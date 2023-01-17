import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { map, Observable, of } from 'rxjs'
import { isArray } from 'src/app/helpers/type-checkers'
import { convertToColumnizedArray } from 'src/app/helpers/value-converters'
import { FormInputOption } from 'src/app/models/client-specs/form/form-input-types'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { CssService } from 'src/app/services/shared/css.service'
import { v4 as uuid } from 'uuid'
import { SuperInputComponent } from '../inheritances/super-input.component'

@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: [
    '../../../../../styles/templates/select-options-input.component.scss',
  ],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent extends SuperInputComponent<string[]> {
  private readonly _COMPONENT_UNIQUE_ID = uuid()

  protected optionValues$!: Observable<FormInputOption[]>

  get columnWidth() {
    return { width: `calc(100% / ${this._columnCount})` }
  }

  get componentUniqueId() {
    return this._COMPONENT_UNIQUE_ID
  }

  get _options() {
    return this.formInputSpec.options
  }

  get _optionsFetchUrl() {
    return this.formInputSpec.optionsFetchUrl
  }

  get _columnCount() {
    return this.formInputSpec.columnCount ?? 2
  }

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly cssService: CssService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(cssService, changeDetectorRef)
  }

  override ngOnInit(): void {
    super.ngOnInit()

    if (this._options && this._options.length > 0) {
      this.optionValues$ = of(this._options)

      this.changeDetectorRef.markForCheck()
      return
    }

    if (!this._optionsFetchUrl) {
      this.optionValues$ = of([])

      this.changeDetectorRef.markForCheck()
      return
    }

    this._fetchOptions()
  }

  readonly getItems = (optionValues: FormInputOption[]) => {
    return convertToColumnizedArray(optionValues, this._columnCount ?? 0)
  }

  readonly trackByIndex = (index: number) => {
    return index
  }

  readonly isSelectedOption = (selectedOptions: string[], option: string) => {
    return selectedOptions.includes(option)
  }

  readonly getSelectedOptions = (optionValues: FormInputOption[]) => {
    const selected = this.control?.value
    if (!isArray(selected)) return []

    return !selected
      ? []
      : optionValues
          .filter((option) => selected.includes(option.value))
          .map((option) => option.value)
  }

  readonly selectOption = (value: string) => {
    if (this.isDisabled) return

    let formValues: string[] = [...(this.control?.value ?? [])]

    if (formValues.includes(value)) {
      formValues = formValues.filter((v) => v !== value)
    } else {
      formValues.push(value)
    }

    this.control?.setValue(formValues)
    this.control?.markAsDirty()
    this.control?.markAsTouched()
  }

  private readonly _fetchOptions = () => {
    if (!this._optionsFetchUrl) return

    this.optionValues$ = this._requestService
      .getGeneralFetch(this._optionsFetchUrl)
      .pipe(
        map((data) =>
          data.map((d) => ({
            ...d,
            label: d.name,
            value: String(d.id),
          })),
        ),
      )

    this.changeDetectorRef.markForCheck()
  }
}
