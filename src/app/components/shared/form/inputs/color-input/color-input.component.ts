import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core'
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  Subscription,
  tap,
} from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { SuperInputComponent } from '../inheritances/super-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-color-input',
  templateUrl: './color-input.component.html',
  styles: [':host {width: 100%}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorInputComponent
  extends SuperInputComponent<[string, string]>
  implements AfterContentInit
{
  @Input() lengthLabelPosition?: 'left' | 'right' = 'right'

  @Output() enter = new EventEmitter<void>()

  textChange$ = new BehaviorSubject<string>('')

  private _valueChangeSubscription$!: Subscription
  private _colorChange$ = new BehaviorSubject<string>('')

  get inputSpec() {
    return {
      ...this.formInputSpec,
      key: `${this.name}Text`,
    } as unknown as FormInputSpec<string>
  }

  get color() {
    return this._colorChange$.value
  }

  get inputParam() {
    return {
      ...this.input,
      valueChange$: this.textChange$,
      formInputSpec: this.inputSpec,
    }
  }

  get valueChange$() {
    const text$ = (this.form.get(this.name)?.valueChanges ??
      of('')) as Observable<string>
    const color$ = (this.form.get(`${this.name}Color`)?.valueChanges ??
      of('')) as Observable<string>

    return combineLatest([text$, color$])
  }

  ngAfterContentInit(): void {
    const colorKey = `${this.name}Color`

    if (this.isDisabled) {
      this.form?.get(colorKey)?.disable()
    } else {
      this.form?.get(colorKey)?.enable()
    }

    this._valueChangeSubscription$ = this.valueChange$
      .pipe(
        tap(([text, color]) => {
          this.textChange$.next(text)
          this._colorChange$.next(color)
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()
  }

  readonly onSelectColor = (value: string) => {
    this.form?.get(`${this.name}Color`)?.setValue(value)
  }

  readonly onEnter = () => {
    this.enter.emit()
  }
}
