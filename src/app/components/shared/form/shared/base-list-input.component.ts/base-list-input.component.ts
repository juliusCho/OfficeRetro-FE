import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core'
import { BehaviorSubject, map, Observable, of, Subscription, tap } from 'rxjs'
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
  extends SuperInputComponent
  implements OnInit, AfterContentInit, AfterViewInit
{
  @Input() validator?: (value?: string[]) => string // fn for validate value & get invalid message
  @Input() options?: Record<string, string>[]
  @Input() optionsFetchUrl?: string
  @Input() valueChange$!: BehaviorSubject<string[]>

  protected valueChangeObservable$!: Observable<string[]>
  protected valueChangeSubscription$?: Subscription
  protected optionValues$: Observable<Array<{ label: string; value: string }>> =
    of([])
  protected optionValuesObservableListener$ = new BehaviorSubject(0)

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_changeDetectorRef)
  }

  ngOnInit(): void {
    if (this.isDisabled) {
      this.form.get(this.name)?.disable()
      return
    }

    this.form.get(this.name)?.enable()

    this.valueChangeObservable$ = this.valueChange$.pipe(
      tap((v) => {
        this.showValidationMessage = false
        this.validationMessage = this.validate(v)

        this._changeDetectorRef.markForCheck()
      }),
    )

    this._changeDetectorRef.detectChanges()
  }

  ngAfterContentInit() {
    if (this.options && this.options.length > 0) {
      this.optionValues$ = of(
        this.options.map((o) => {
          const [value, label] = Object.entries(o)[0]
          return { value, label }
        }),
      ).pipe(tap(this.updateContextObservableListener))

      this._changeDetectorRef.detectChanges()
      return
    }

    if (!this.optionsFetchUrl) return

    this.fetchOptions()
  }

  ngAfterViewInit(): void {
    this.valueChangeSubscription$ = this.valueChangeObservable$.subscribe()
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
        tap(this.updateContextObservableListener),
      )

    this._changeDetectorRef.detectChanges()
  }

  private readonly validate = (value?: string[]) => {
    if (this.isDisabled) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    return getBasicListInputValidationMsg({
      value,
      label: this.label,
      required: this.required,
      minLength: this.minLength,
      maxLength: this.maxLength,
    })
  }

  private readonly updateContextObservableListener = () => {
    this.optionValuesObservableListener$.next(
      this.optionValuesObservableListener$.value + 1,
    )
    this._changeDetectorRef.markForCheck()
  }
}
