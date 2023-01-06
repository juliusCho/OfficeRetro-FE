import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core'
import * as moment from 'moment'
import { BehaviorSubject, Observable, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { isDate } from 'src/app/helpers/type-checkers'
import { SuperInputComponent } from '../super-input.component'

@AutoUnsubscribe()
@Component({
  template: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDateInputComponent<T>
  extends SuperInputComponent<T>
  implements OnInit
{
  @Input() valueChange$!: BehaviorSubject<T>

  protected valueChangeObservable$?: Observable<T>

  get validator() {
    return this.isValidationNeeded
      ? this.formInputSpec?.validMessageGenerator
      : undefined
  }

  get minDate() {
    return isDate(this.formInputSpec?.min)
      ? moment(this.formInputSpec.min)
      : undefined
  }
  get maxDate() {
    return isDate(this.formInputSpec?.max)
      ? moment(this.formInputSpec.max).toDate()
      : undefined
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

        this.changeDetectorRef.markForCheck()
      }),
    )

    this.changeDetectorRef.detectChanges()
  }

  readonly onPickerClose = () => {
    if (this.isDisabled) return
    this.onFocusOut()
  }
}
