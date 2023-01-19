import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { Observable, tap } from 'rxjs'
import { Toast } from 'src/app/models/client-specs/shared/ui-specs'
import { ICONS } from 'src/app/models/constants/css-constants'
import { CssService } from 'src/app/services/shared/css.service'
import { GlobalService } from 'src/app/services/shared/global.service'
import { TextModule } from '../text/text.module'

@Component({
  standalone: true,
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  imports: [CommonModule, TextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToastComponent implements OnInit {
  show = true
  toast$!: Observable<Toast>

  private readonly _SHOW_TIME = 2500

  private _toastType?: 'alert' | 'info'
  private _timeoutKey?: NodeJS.Timeout

  get closeIcon() {
    return ICONS.CROSS
  }

  get defaultAlertMessage() {
    return 'An unexpected error has occurred. Please try again.'
  }

  get messageStyle(): Record<string, string> {
    if (this._toastType !== 'alert') return {}
    return { color: this._cssService.getColor('error') ?? '' }
  }

  constructor(
    private readonly _globalService: GlobalService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _cssService: CssService,
  ) {}

  ngOnInit(): void {
    this.toast$ = this._globalService.toast$.pipe(
      tap((v) => {
        this._toastType = v.type

        if (v.show) {
          this.show = true

          this._timeoutKey = setTimeout(() => {
            this.show = false

            this._changeDetectorRef.detectChanges()
          }, this._SHOW_TIME)
        } else {
          this.show = false

          if (this._timeoutKey) {
            clearTimeout(this._timeoutKey)

            this._timeoutKey = undefined
          }
        }

        this._changeDetectorRef.detectChanges()
      }),
    )
  }

  readonly onClose = () => {
    this._globalService.toast = { show: false }
  }
}
