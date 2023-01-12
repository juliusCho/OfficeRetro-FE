import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
} from '@angular/core'
import { Observable, of, Subscription } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import {
  getBasicEmailValidationMsg,
  getBasicStringInputValidationMsg,
} from 'src/app/helpers/input-valid-msg-generators'
import { SuperInputComponent } from '../super-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseInputComponent
  extends SuperInputComponent<string>
  implements AfterContentInit
{
  protected valueChangeObservable$?: Observable<string>
  protected valueChangeSubscription$?: Subscription

  get valueChange$() {
    return (this.form.get(this.name)?.valueChanges ??
      of('')) as Observable<string>
  }
  get validator() {
    return this.formInputSpec?.validMessageGenerator
  }

  override ngOnInit(): void {
    this.ngOnInitAction()

    if (this.isDisabled) {
      this.form?.get(this.name)?.disable()
      return
    }

    this.form?.get(this.name)?.enable()

    // this.valueChangeObservable$ = this.valueChange$.pipe(
    //   shareReplay({ bufferSize: 1, refCount: true }),
    //   tap((v) => {
    //     this.showValidationMessage = false
    //     this.validationMessage = this.validate(v)

    //     this.changeDetectorRef.markForCheck()
    //   }),
    // )

    // this.changeDetectorRef.detectChanges()
  }

  ngAfterContentInit(): void {
    this.ngAfterContentInitAction()
  }

  protected readonly ngAfterContentInitAction = () => {
    // this.valueChangeSubscription$ = this.valueChangeObservable$?.subscribe()
  }

  protected readonly validate = (value?: string) => {
    if (this.isDisabled || !this.isValidationNeeded) return ''

    const result = this.validator ? this.validator(value) : ''
    if (result !== '') return result

    const validResult = getBasicStringInputValidationMsg({
      value,
      label: this.label,
      required: this.required,
      min: this.min,
      max: this.max,
    })
    if (validResult !== '') return validResult

    if (this.formInputSpec.inputType !== 'email') return ''

    return getBasicEmailValidationMsg(value)
  }
}
