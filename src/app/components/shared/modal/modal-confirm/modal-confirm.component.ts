import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { Observable, tap } from 'rxjs'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { ModalConfirm } from 'src/app/models/client-specs/shared/ui-specs'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  selector: 'app-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalConfirmComponent implements OnInit {
  show = false
  message?: string
  buttons?: {
    submit: string
    cancel: string
  }
  width?: CssSize
  onSubmit?: () => void
  modal$!: Observable<ModalConfirm>

  constructor(
    private readonly _globalService: GlobalService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.modal$ = this._globalService.modal$.pipe(
      tap((v) => {
        if (v.type === 'confirm') {
          this.show = v.show
          this.message = v.message
          this.buttons = v.buttons
          this.onSubmit = v.onSubmit
          this.width = v.width

          this._changeDetectorRef.detectChanges()
        }
      }),
    )
  }

  readonly onCancel = () => {
    this._globalService.confirmModal = {
      show: false,
      message: '',
      buttons: {
        submit: '',
        cancel: '',
      },
      onSubmit: () => {},
    }
  }

  readonly submit = () => {
    if (this.onSubmit) {
      this.onSubmit()
    }

    this.onCancel()
  }
}
