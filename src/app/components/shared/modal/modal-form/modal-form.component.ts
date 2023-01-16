import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { Observable, tap } from 'rxjs'
import { FormInputSpec } from 'src/app/models/client-specs/form/form-spec'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import {
  ModalConfirm,
  ModalForm,
} from 'src/app/models/client-specs/shared/ui-specs'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  selector: 'app-modal-form',
  templateUrl: './modal-form.component.html',
  styleUrls: ['./modal-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalFormComponent implements OnInit {
  show = false
  title?: string
  formInputSpecs?: FormInputSpec<unknown>[]
  isClearButtonExist?: boolean
  confirmModal: Omit<ModalConfirm, 'onSubmit'> = { show: false }
  isFormConfirmed = true
  formValue?: Record<string, unknown>
  width?: CssSize
  onSubmit?: (formValue?: Record<string, unknown>) => void
  modal$!: Observable<ModalForm>

  private _buttons?: {
    submit: string
    cancel: string
  }

  get buttonArea() {
    return this._buttons
      ? {
          submitButton: { label: this._buttons.submit },
          cancelButton: { label: this._buttons.cancel },
          clearButton: this.isClearButtonExist ? { label: 'Clear' } : undefined,
        }
      : undefined
  }

  constructor(
    private readonly _globalService: GlobalService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.modal$ = this._globalService.modal$.pipe(
      tap((v) => {
        if (v.type === 'form') {
          this.show = v.show
          this.title = v.title
          this._buttons = v.buttons
          this.formInputSpecs = v.formInputSpecs
          this.isClearButtonExist = v.isClearButtonExist
          this.onSubmit = v.onSubmit
          this.confirmModal = v.confirmModal
            ? { ...v.confirmModal, show: false }
            : { show: false }
          this.width = v.width
          this.isFormConfirmed = !v.confirmModal

          this._changeDetectorRef.detectChanges()
        }
      }),
    )
  }

  readonly submit = (formValue?: Record<string, unknown>) => {
    if (this.isFormConfirmed) {
      if (this.onSubmit) {
        this.onSubmit(formValue)
      }

      this.onCancel()
      return
    }

    this.formValue = formValue
    this.confirmModal = { ...this.confirmModal, show: true }

    this._changeDetectorRef.detectChanges()
  }

  readonly onCancel = () => {
    this.isFormConfirmed = true
    this._changeDetectorRef.detectChanges()

    this._globalService.formModal = {
      show: false,
      title: '',
      buttons: {
        submit: '',
        cancel: '',
      },
      onSubmit: () => {},
      formInputSpecs: [],
    }
  }

  readonly confirmSubmit = () => {
    this.isFormConfirmed = true
    this._changeDetectorRef.detectChanges()

    this.submit(this.formValue)
  }

  readonly confirmCancel = () => {
    this.confirmModal = { ...this.confirmModal, show: false }

    this._changeDetectorRef.markForCheck()
  }
}
