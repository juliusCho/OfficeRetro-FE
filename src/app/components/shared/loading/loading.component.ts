import { CommonModule } from '@angular/common'
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { AutoUnsubscribe } from 'src/app/decorators/auto-unsubscribe/auto-unsubscribe.decorator'
import { ICONS } from 'src/app/models/constants/css-constants'
import { GlobalService } from 'src/app/services/shared/global.service'

@AutoUnsubscribe()
@Component({
  standalone: true,
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent implements OnInit {
  private _loading = false
  private _loadingSubscription$!: Subscription

  isLoading = false

  get loading() {
    return this._loading
  }

  set loading(value: boolean) {
    if (value) {
      this._loading = value
      this._changeDetectorRef.markForCheck()

      setTimeout(() => {
        this.isLoading = value
        this._changeDetectorRef.detectChanges()
      }, 100)
      return
    }

    this.isLoading = value
    this._changeDetectorRef.markForCheck()

    setTimeout(() => {
      this._loading = value
      this._changeDetectorRef.detectChanges()
    }, 200)
  }

  get loadingIcon() {
    return ICONS.LOADING_COMPASS
  }

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    private readonly _globalService: GlobalService,
  ) {}

  ngOnInit(): void {
    this._loadingSubscription$ = this._globalService.isLoading$.subscribe(
      (v) => {
        this.loading = v
        this._changeDetectorRef.detectChanges()
      },
    )
  }
}
