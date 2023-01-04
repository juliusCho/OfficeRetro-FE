import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core'
import { BehaviorSubject, debounceTime, tap } from 'rxjs'
import { FormSpec } from 'src/app/models/client-specs/form/form-spec'
import { FormService } from 'src/app/services/form/form.service'

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  providers: [FormService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormComponent implements OnInit, AfterContentInit {
  @Input() formSpecs!: FormSpec<unknown>[]
  @Input() submitLabel?: string
  @Input() width?: string = ''

  @Output() submit = new EventEmitter<void>()

  showValidationMessage = false

  get form() {
    return this._formService.form
  }

  constructor(
    private readonly _formService: FormService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._formService.initialize(this.formSpecs)
  }

  ngAfterContentInit(): void {
    if (this.submitLabel) {
      this._formService.subscribe()
      return
    }

    this._formService.formValueChange
      .pipe(
        debounceTime(1000),
        tap(() => {
          this.submitAction()
          this._changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()
  }

  readonly getValueObservableString = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<string>
  }

  readonly getValueObservableNumber = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<number>
  }

  readonly getValueObservableBoolean = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<boolean>
  }

  readonly getValueObservableArray = (key: string) => {
    return this._formService.getValueObservable(key) as BehaviorSubject<
      string[]
    >
  }

  readonly onSubmit = () => {
    this.submitAction()
    if (this._formService.form.valid) {
      this._formService.reinitializeData()
    }
  }

  private readonly submitAction = () => {
    this.showValidationMessage = false
    this._changeDetectorRef.detectChanges()

    if (this._formService.form.invalid) {
      setTimeout(() => {
        this.showValidationMessage = true
        this._changeDetectorRef.markForCheck()
      }, 10)
      return
    }

    this.submit.emit()
  }
}
