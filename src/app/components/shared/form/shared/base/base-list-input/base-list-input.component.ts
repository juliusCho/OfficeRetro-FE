import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { map, Observable, of, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicListInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { SuperInputComponent } from '../super-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseListInputComponent
  extends SuperInputComponent<string[]>
  implements OnInit
{
  private _valueChangeSubscription$?: Subscription

  protected optionValues$!: Observable<Array<{ label: string; value: string }>>

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

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(changeDetectorRef)
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

  protected readonly getSelectedOptions = (
    optionValues: Array<{ label: string; value: string }>,
  ) => {
    const selected = this.form.value[this.name]

    return !selected
      ? []
      : optionValues
          .filter((option) => selected.includes(option.value))
          .map((option) => option.value)
  }

  private readonly setOptionValueObservable = () => {
    if (this.options && this.options.length > 0) {
      this.optionValues$ = of(
        this.options.map((o) => {
          const [value, label] = Object.entries(o)[0]
          return { value, label }
        }),
      )

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
