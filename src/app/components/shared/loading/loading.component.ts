import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core'
import { ICONS } from 'src/app/models/constants/css-constants'

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoadingComponent {
  @Input() set loading(value: boolean) {
    if (value) {
      this._loading = value
      this._changeDetectorRef.markForCheck()

      setTimeout(() => {
        this.isLoading = value
        this._changeDetectorRef.markForCheck()
      }, 100)
      return
    }

    this.isLoading = value
    this._changeDetectorRef.markForCheck()

    setTimeout(() => {
      this._loading = value
      this._changeDetectorRef.markForCheck()
    }, 200)
  }

  private _loading = false

  isLoading = false

  get loading() {
    return this._loading
  }

  get loadingIcon() {
    return ICONS.LOADING_COMPASS
  }

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) {}
}
