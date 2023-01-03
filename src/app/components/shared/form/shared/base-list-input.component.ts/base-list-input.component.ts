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
  implements OnInit, AfterViewInit, AfterContentInit
{
  @Input() formChange$?: BehaviorSubject<string[]> // form.valueChange observable
  @Input() validator?: (value?: string[]) => string // fn for validate value & get invalid message
  @Input() options?: Record<string, string>[]
  @Input() optionsFetchUrl?: string
  @Input() excludeValue?: string

  protected optionValues$: Observable<Array<{ label: string; value: string }>> =
    of([])
  protected optionValuesObservableSeq = 0
  protected _formChangeSubscription$?: Subscription
  protected _formChangeObservable$?: Observable<string[]>

  constructor(
    private readonly _requestService: HttpCommonService,
    protected override readonly _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_changeDetectorRef)
  }

  ngOnInit(): void {
    if (this.isDisabled) {
      this.form?.get(this.name)?.disable()
      return
    }

    this.form?.get(this.name)?.enable()

    this._formChangeObservable$ = this.formChange$?.pipe(
      tap((v) => {
        this.showValidationMessage = false
        this.validationMessage = this.validate(v)
        this._changeDetectorRef.markForCheck()
      }),
    )
  }

  ngAfterViewInit(): void {
    this._formChangeSubscription$ = this._formChangeObservable$?.subscribe()
  }

  ngAfterContentInit() {
    if (this.options && this.options.length > 0) {
      this.optionValues$ = of(
        this.options
          .filter((o) => Object.values(o)[0] !== this.excludeValue)
          .map((o) => {
            const [value, label] = Object.entries(o)[0]
            return { value, label }
          }),
      )

      this.optionValuesObservableSeq += 1

      this._changeDetectorRef.detectChanges()
      return
    }

    if (!this.optionsFetchUrl) return

    this.fetchOptions()
  }

  private readonly fetchOptions = () => {
    if (!this.optionsFetchUrl) return

    this.optionValues$ = this._requestService
      .getGeneralFetch(this.optionsFetchUrl)
      .pipe(
        map((data) =>
          data
            .filter((d) => String(d.id) !== this.excludeValue)
            .map((d) => ({
              label: d.name,
              value: String(d.id),
            })),
        ),
      )

    this.optionValuesObservableSeq += 1

    this._changeDetectorRef.detectChanges()
  }

  private readonly validate = (value?: string[]) => {
    if (this.isDisabled) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    if (!value || value.length === 0) {
      if (this.required) {
        return `${this.label} requires at least 1 item`
      }

      if (this.minLength > 0) {
        return `${this.label} must contain at least\n${this.minLength} item(s)`
      }

      return ''
    }

    if (this.maxLength === -1) {
      if (this.minLength > 0 && this.minLength > value.length) {
        return `${this.label} should contain\n less than ${this.minLength} item(s)`
      }

      return ''
    }

    if (this.minLength > 0) {
      if (this.minLength > value.length || value.length > this.maxLength) {
        return `${this.label} should contain\n${this.minLength}-${this.maxLength} items`
      }

      return ''
    }

    if (value.length > this.maxLength) {
      return `${this.label} should not contain\n more than ${this.maxLength} item(s)`
    }

    return ''
  }
}
