import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core'
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { BaseInputComponent } from '../base-input/base-input.component'

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
  protected selectedOption$ = new BehaviorSubject<{
    label: string
    value: string
  }>({
    label: this.placeholder ?? '',
    value: '',
  })

  get options() {
    return this.formInputSpec?.options
  }
  get optionsFetchUrl() {
    return this.formInputSpec?.optionsFetchUrl
  }

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_changeDetectorRef)
  }

  override ngAfterViewInit(): void {
    this.valueChangeSubscription$ = this.valueChangeObservable$
      ?.pipe(
        tap((v) => {
          if (v === this.selectedOption$.value.value) return
          if (v === '') {
            this.selectedOption$.next({
              label: this.placeholder ?? '',
              value: '',
            })

            this._changeDetectorRef.markForCheck()
          }
        }),
      )
      .subscribe()

    this._changeDetectorRef.detectChanges()
  }

  ngAfterContentInit(): void {
    this.maxLength = -1

    this._changeDetectorRef.detectChanges()

    if (this.options && this.options.length > 0) {
      this.optionValues$ = of([
        { label: this.placeholder ?? '', value: '' },
        ...this.options.map((o) => {
          const [value, label] = Object.entries(o)[0]
          return { value, label }
        }),
      ]).pipe(tap(this.setSelectedOptionSubject))

      this._changeDetectorRef.detectChanges()
      return
    }

    if (!this.optionsFetchUrl) return

    this.fetchOptions()
  }

  protected readonly selectOption = (option: {
    value: string
    label: string
  }) => {
    if (this.isDisabled) return

    this.form.get(this.name)?.setValue(option.value)
    this.selectedOption$.next(option)

    this._changeDetectorRef.detectChanges()

    this.onFocusOut()
  }

  private readonly fetchOptions = () => {
    if (!this.optionsFetchUrl) return

    this.optionValues$ = this._requestService
      .getGeneralFetch(this.optionsFetchUrl)
      .pipe(
        map((data) => [
          { label: this.placeholder ?? '', value: '' },
          ...data.map((d) => ({
            label: d.name,
            value: String(d.id),
          })),
        ]),
        tap(this.setSelectedOptionSubject),
      )

    this._changeDetectorRef.detectChanges()
  }

  private readonly setSelectedOptionSubject = (
    values: Array<{ value: string; label: string }>,
  ) => {
    const value = values.find(
      (item) => !!item.value && item.value === this.form.value[this.name],
    )
    this.selectedOption$.next(
      value ?? { label: this.placeholder ?? '', value: '' },
    )

    this._changeDetectorRef.markForCheck()
  }
}
