import { Injectable } from '@angular/core'
import { PreloadingStrategy, Route } from '@angular/router'
import { map, Observable, of, timer } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PreloadingStrategyService implements PreloadingStrategy {
  readonly preload = (
    route: Route,
    fn: () => Observable<unknown>,
  ): Observable<unknown> => {
    if (this._isNavigatorWithConnection(navigator)) {
      const connection = navigator['connection']
      if (connection.saveData) {
        return of(null)
      }

      const speed = connection.effectiveType
      const slowConnections = ['slow-2g', '2g']
      if (slowConnections.includes(speed)) {
        return of(null)
      }
    }

    if (route.data && route.data['preload']) {
      const delay = route.data['loadAfterSeconds']
        ? route.data['loadAfterSeconds']
        : 0
      return this._loadRoute(delay, fn)
    }

    return of(null)
  }

  private readonly _isNavigatorWithConnection = (
    nav: Navigator,
  ): nav is Navigator & {
    connection: { saveData: boolean; effectiveType: string }
  } => {
    if ('connection' in nav) return true

    return false
  }

  private readonly _loadRoute = (
    delay: number,
    fn: () => Observable<unknown>,
  ) => {
    return delay > 0 ? timer(delay * 1000).pipe(map(() => fn())) : fn()
  }
}
