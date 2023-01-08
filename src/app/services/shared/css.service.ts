import { Injectable } from '@angular/core'
import { CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { SIZE_LIST } from 'src/app/models/constants/css-constants'

@Injectable()
export class CssService {
  private readonly _sizeMap = new Map<string, string>()

  readonly getSize = (key?: CssSize) => {
    if (!key) return
    return this._sizeMap.get(key)
  }

  readonly getUntypedSize = (key?: string) => {
    if (!key || !this.isCssSize(key)) return key
    return this._sizeMap.get(key)
  }

  readonly loadSizes = () => {
    const appElement = document.getElementsByClassName('css-size')
    if (appElement && appElement.length > 0) {
      const appStyles = window.getComputedStyle(appElement[0])

      SIZE_LIST.forEach((size) => {
        this._sizeMap.set(size, appStyles.getPropertyValue(`--${size}`))
      })
    }
  }

  private readonly isCssSize = (key: string): key is CssSize => {
    return SIZE_LIST.some((size) => size === key)
  }
}
