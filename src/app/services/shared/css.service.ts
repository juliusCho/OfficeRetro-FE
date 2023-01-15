import { Injectable } from '@angular/core'
import { isStringArray } from 'src/app/helpers/type-checkers'
import { CssColor, CssSize } from 'src/app/models/client-specs/shared/css-specs'
import { COLOR_LIST, SIZE_LIST } from 'src/app/models/constants/css-constants'

@Injectable()
export class CssService {
  private readonly _SIZE_MAP = new Map<string, string>()
  private readonly _COLOR_MAP = new Map<string, string>()

  readonly getSize = (key?: CssSize) => {
    if (!key) return
    return this._SIZE_MAP.get(key)
  }

  readonly getUntypedSize = (key?: string) => {
    if (!key || !this._isCssSize(key)) return key
    return this._SIZE_MAP.get(key)
  }

  readonly getColor = (key?: CssColor) => {
    if (!key) return
    return this._COLOR_MAP.get(key)
  }

  readonly loadSizes = () => {
    this._loadCss(SIZE_LIST, this._SIZE_MAP, 'css-size')
  }

  readonly loadColors = () => {
    this._loadCss(COLOR_LIST, this._COLOR_MAP, 'css-color')
  }

  private readonly _loadCss = <T>(
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

  private readonly _isCssSize = (key: string): key is CssSize => {
    return SIZE_LIST.some((size) => size === key)
  }
}
