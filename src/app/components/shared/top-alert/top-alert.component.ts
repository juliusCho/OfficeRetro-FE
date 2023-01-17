import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { Observable, tap } from 'rxjs'
import { TopAlert } from 'src/app/models/client-specs/shared/ui-specs'
import { ICONS } from 'src/app/models/constants/css-constants'
import { CssService } from 'src/app/services/shared/css.service'
import { GlobalService } from 'src/app/services/shared/global.service'
import { TextModule } from '../text/text.module'

@Component({
  standalone: true,
  selector: 'app-top-alert',
  templateUrl: './top-alert.component.html',
  styleUrls: ['./top-alert.component.scss'],
  imports: [CommonModule, TextModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopAlertComponent implements OnInit {
  show = true
  topAlert$!: Observable<TopAlert>

  private readonly _SHOW_TIME = 2500

  private _alertType?: 'alert' | 'info'
  private _timeoutKey?: NodeJS.Timeout

  get closeIcon() {
    return ICONS.CROSS
  }

  get defaultAlertMessage() {
    return 'An unexpected error has occurred. Please try again.'
  }

  get messageStyle(): Record<string, string> {
    if (this._alertType !== 'alert') return {}
    return { color: this._cssService.getColor('error') ?? '' }
  }

  constructor(
    private readonly _globalService: GlobalService,
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _cssService: CssService,
  ) {}

  ngOnInit(): void {
    this.topAlert$ = this._globalService.topAlert$.pipe(
      tap((v) => {
        this._alertType = v.type

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
    this._globalService.topAlert = { show: false }
  }
}
