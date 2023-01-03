import { Injectable } from '@angular/core'
import { PreloadingStrategy, Route } from '@angular/router'
import { map, Observable, of, timer } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class PreloadingStrategyService implements PreloadingStrategy {
  preload(route: Route, fn: () => Observable<unknown>): Observable<unknown> {
    if (isNavigatorWithConnection(navigator)) {
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

    const loadRoute = (delay: number) =>
      delay > 0 ? timer(delay * 1000).pipe(map(() => fn())) : fn()

    if (route.data && route.data['preload']) {
      const delay = route.data['loadAfterSeconds']
        ? route.data['loadAfterSeconds']
        : 0
      return loadRoute(delay)
    }

    return of(null)
  }
}

const isNavigatorWithConnection = (
  nav: Navigator,
): nav is Navigator & {
  connection: { saveData: boolean; effectiveType: string }
} => {
  if ('connection' in nav) return true

  return false
}
