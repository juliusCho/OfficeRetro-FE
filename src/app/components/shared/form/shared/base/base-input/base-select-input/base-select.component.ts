import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { map, Observable, of } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { BaseInputComponent } from '../base-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseSelectComponent
  extends BaseInputComponent
  implements AfterContentInit
{
  protected optionValues$!: Observable<Array<{ label: string; value: string }>>

  get options() {
    return this.formInputSpec?.options
  }
  get optionsFetchUrl() {
    return this.formInputSpec?.optionsFetchUrl
  }

  constructor(
    protected readonly requestService: HttpCommonService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(changeDetectorRef)
  }

  ngAfterContentInit(): void {
    this.max = '-1'

    this.changeDetectorRef.detectChanges()

    if (this.options && this.options.length > 0) {
      this.optionValues$ = of([
        { label: this.placeholder ?? '', value: '' },
        ...this.options.map((o) => {
          const [value, label] = Object.entries(o)[0]
          return { value, label }
        }),
      ])

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

  protected readonly selectOption = (option: {
    value: string
    label: string
  }) => {
    if (this.isDisabled) return

    this.form.get(this.name)?.setValue(option.value)

    this.onFocusOut()
  }

  protected readonly getSelectedOption = (
    optionValues: Array<{ label: string; value: string }>,
  ) => {
    const selected = this.form.value[this.name]
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
            label: d.name,
            value: String(d.id),
          })),
        ]),
      )

    this.changeDetectorRef.detectChanges()
  }
}
