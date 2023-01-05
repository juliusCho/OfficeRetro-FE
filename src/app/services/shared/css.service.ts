import { Injectable } from '@angular/core'
import { SIZE_LIST } from 'src/app/models/constants/css-constants'

@Injectable()
export class CssService {
  private readonly _sizeMap = new Map<string, string>()

  readonly getSize = (key: typeof SIZE_LIST[number]) => {
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
}
