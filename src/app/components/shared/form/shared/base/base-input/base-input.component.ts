import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core'
import { BehaviorSubject, Observable, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { getBasicStringInputValidationMsg } from 'src/app/helpers/input-valid-msg-generators'
import { isString } from 'src/app/helpers/type-checkers'
import { isValidEmail } from 'src/app/helpers/validators'
import { SuperInputComponent } from '../super-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseInputComponent
  extends SuperInputComponent<string>
  implements OnInit, AfterViewInit
{
  @Input() valueChange$!: BehaviorSubject<string>

  protected valueChangeObservable$!: Observable<string>
  protected valueChangeSubscription$?: Subscription

  get validator() {
    return this.formInputSpec?.validMessageGenerator
  }

  constructor(
    protected override readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    super(changeDetectorRef)
  }

  ngOnInit(): void {
    if (this.isDisabled) {
      this.form?.get(this.name)?.disable()
      return
    }

    this.form?.get(this.name)?.enable()

    this.valueChangeObservable$ = this.valueChange$.pipe(
      tap((v) => {
        this.showValidationMessage = false
        this.validationMessage = this.validate(v)
        this.changeDetectorRef.markForCheck()
      }),
    )

    this.changeDetectorRef.detectChanges()
  }

  ngAfterViewInit(): void {
    this.valueChangeSubscription$ = this.valueChangeObservable$.subscribe()
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

    if (!value) return ''
    if (!isString(value)) return ''

    if (/ /g.test(value)) {
      return 'Email should not contain blank space'
    }

    if (!isValidEmail(value)) {
      return 'Invalid email format'
    }

    return ''
  }
}
