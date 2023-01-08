import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { BehaviorSubject, Subscription, tap } from 'rxjs'
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
  implements OnInit
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

  ngOnInit(): void {
    const colorKey = `${this.name}Color`

    if (this.isDisabled) {
      this.form?.get(colorKey)?.disable()
    } else {
      this.form?.get(colorKey)?.enable()
    }

    this._valueChangeSubscription$ = this.valueChange$
      .pipe(
        tap((v) => {
          this.textChange$.next(v[0])
          this._colorChange$.next(v[1])
        }),
      )
      .subscribe()
  }

  readonly onSelectColor = (value: string) => {
    this.form?.get(`${this.name}Color`)?.setValue(value)
  }

  readonly onEnter = () => {
    this.enter.emit()
  }
}
