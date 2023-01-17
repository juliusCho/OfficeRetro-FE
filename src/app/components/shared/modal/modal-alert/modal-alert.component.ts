import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { Observable, tap } from 'rxjs'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { ModalAlert } from 'src/app/models/client-specs/shared/ui-specs'
import { GlobalService } from 'src/app/services/shared/global.service'

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAlertComponent implements OnInit {
  show = false
  title?: string
  message?: string
  width?: CssSize
  modal$!: Observable<ModalAlert>

  constructor(
    private readonly _globalService: GlobalService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.modal$ = this._globalService.modal$.pipe(
      tap((v) => {
        if (!v.type || v.type === 'alert') {
          this.show = v.show
          this.title = v.title
          this.message = v.message
          this.width = v.width

          this._changeDetectorRef.detectChanges()
        }
      }),
    )
  }

  readonly onSubmit = () => {
    this._globalService.alertModal = {
      show: false,
      title: '',
      message: '',
    }
  }
}
