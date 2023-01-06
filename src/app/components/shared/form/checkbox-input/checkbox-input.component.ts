import { ChangeDetectionStrategy, Component } from '@angular/core'
import { BehaviorSubject, Subscription, tap } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { convertToColumnizedArray } from 'src/app/helpers/value-converters'
import { HttpCommonService } from 'src/app/services/https/http-common.service'
import { v4 as uuid } from 'uuid'
import { BaseListInputComponent } from '../shared/base/base-list-input/base-list-input.component'

@AutoUnsubscribe()
@Component({
  selector: 'app-checkbox-input',
  templateUrl: './checkbox-input.component.html',
  styleUrls: [
    '../../../../styles/templates/select-options-input.component.scss',
  ],
  providers: [HttpCommonService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxInputComponent extends BaseListInputComponent {
  selectedOptions$ = new BehaviorSubject<string[]>([])

  private readonly _componentUniqueId = uuid()
  private _parentObservableSubscription$!: Subscription

  get columnCount() {
    return this.formInputSpec?.columnCount ?? 2
  }

  get columnWidth() {
    return `calc(100% / ${this.columnCount})`
  }

  get componentUniqueId() {
    return this._componentUniqueId
  }

  override ngAfterViewInit(): void {
    this.subscribeFormValueChange()

    this._parentObservableSubscription$ = this.optionValuesObservableListener$
      .pipe(
        tap(() => {
          this.optionValues$ = this.optionValues$.pipe(
            tap(this.setSelectedOptionsSubject),
          )

          this.changeDetectorRef.markForCheck()
        }),
      )
      .subscribe()

    this.changeDetectorRef.detectChanges()
  }

  readonly getItems = (
    optionValues: Array<{ label: string; value: string }>,
  ) => {
    return convertToColumnizedArray(optionValues, this.columnCount ?? 0)
  }

  readonly isSelectedOption = (selectedOptions: string[], option: string) => {
    return selectedOptions.includes(option)
  }

  readonly selectOption = (value: string) => {
    if (this.isDisabled) return

    let formValues: string[] = [...(this.form.value[this.name] ?? [])]
    if (formValues.includes(value)) {
      formValues = formValues.filter((v) => v !== value)
    } else {
      formValues.push(value)
    }
    this.form.get(this.name)?.setValue(formValues)
    this.selectedOptions$.next(formValues)

    this.onFocusOut()
  }

  private readonly subscribeFormValueChange = () => {
    this.valueChangeSubscription$ = this.valueChangeObservable$
      .pipe(
        tap((v) => {
          if (v.length === 0) {
            this.selectedOptions$.next([])

            this.changeDetectorRef.markForCheck()
          }
        }),
      )
      .subscribe()
  }

  private readonly setSelectedOptionsSubject = (
    values: Array<{ value: string; label: string }>,
  ) => {
    const vals = values
      .filter((item) => this.form.value[this.name].includes(item.value))
      .map((item) => item.value)

    this.selectedOptions$.next(vals)

    this.changeDetectorRef.markForCheck()
  }
}
