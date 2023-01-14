import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { map, Observable, of } from 'rxjs'
import { FormInputOption } from 'src/app/models/client-specs/form/form-input-types'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { CssService } from 'src/app/services/shared/css.service'
import { SuperInputComponent } from '../super-input.component'

@Component({
  template: '',
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSelectInputComponent extends SuperInputComponent<string> {
  protected optionValues$!: Observable<FormInputOption[]>

  get options() {
    return this.formInputSpec.options
  }
  get optionsFetchUrl() {
    return this.formInputSpec.optionsFetchUrl
  }

  constructor(
    protected readonly requestService: HttpCommonService,
    protected override readonly cssService: CssService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(cssService, changeDetectorRef)
  }

  override ngOnInit(): void {
    super.ngOnInit()

    if (this.options && this.options.length > 0) {
      this.optionValues$ = of([
        { label: this.placeholder ?? '', value: '' },
        ...this.options,
      ])

      this.changeDetectorRef.markForCheck()
      return
    }

    if (!this.optionsFetchUrl) {
      this.optionValues$ = of([])
      this.changeDetectorRef.markForCheck()
      return
    }

    this.fetchOptions()
  }

  protected readonly selectOption = (option: FormInputOption) => {
    if (this.isDisabled) return

    this.control?.setValue(option.value)
    this.control?.markAsDirty()
  }

  protected readonly getSelectedOption = (optionValues: FormInputOption[]) => {
    const selected = this.control?.value
    const initValue = { label: this.placeholder ?? '', value: '' }

    if (!selected) return initValue

    return !selected
      ? initValue
      : optionValues.find((option) => option.value === selected) ?? initValue
  }

  private readonly fetchOptions = () => {
    if (!this.optionsFetchUrl) return

    this.optionValues$ = this.requestService
      .getGeneralFetch(this.optionsFetchUrl)
      .pipe(
        map((data) => [
          { label: this.placeholder ?? '', value: '' },
          ...data.map((d) => ({
            ...d,
            label: d.name,
            value: String(d.id),
          })),
        ]),
      )

    this.changeDetectorRef.markForCheck()
  }
}
