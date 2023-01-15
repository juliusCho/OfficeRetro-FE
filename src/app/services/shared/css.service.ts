import { Injectable } from '@angular/core'
import { isStringArray } from 'src/app/helpers/type-checkers'
import { CssColor, CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { COLOR_LIST, SIZE_LIST } from 'src/app/models/constants/css-constants'

@Injectable()
export class CssService {
  private readonly _sizeMap = new Map<string, string>()
  private readonly _colorMap = new Map<string, string>()

  readonly getSize = (key?: CssSize) => {
    if (!key) return
    return this._sizeMap.get(key)
  }

  readonly getUntypedSize = (key?: string) => {
    if (!key || !this.isCssSize(key)) return key
    return this._sizeMap.get(key)
  }

  readonly getColor = (key?: CssColor) => {
    if (!key) return
    return this._colorMap.get(key)
  }

  readonly loadSizes = () => {
    this.loadCss(SIZE_LIST, this._sizeMap, 'css-size')
  }

  readonly loadColors = () => {
    this.loadCss(COLOR_LIST, this._colorMap, 'css-color')
  }

  private readonly loadCss = <T>(
    list: T,
    mapper: Map<string, string>,
    className: string,
  ) => {
    if (!isStringArray(list)) return

    const appElement = document.getElementsByClassName(className)
    if (appElement && appElement.length > 0) {
      const appStyles = window.getComputedStyle(appElement[0])

      list.forEach((css) => {
        mapper.set(css, appStyles.getPropertyValue(`--${css}`))
      })
    }
  }

  private readonly isCssSize = (key: string): key is CssSize => {
    return SIZE_LIST.some((size) => size === key)
  }
}
