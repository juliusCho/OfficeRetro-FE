import { Injectable } from '@angular/core'
import { BehaviorSubject, shareReplay } from 'rxjs'
import { TopAlert } from 'src/app/models/client-specs/shared/ui-specs'

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  private _isLoading$ = new BehaviorSubject(false)
  private _topAlert$ = new BehaviorSubject<TopAlert>({ show: false })

  get isLoading$() {
    return this._isLoading$
      .asObservable()
      .pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  get isLoading() {
    return this._isLoading$.value
  }

  set isLoading(value: boolean) {
    this._isLoading$.next(value)
  }

  get topAlert$() {
    return this._topAlert$
      .asObservable()
      .pipe(shareReplay({ bufferSize: 1, refCount: true }))
  }

  get topAlert() {
    return this._topAlert$.value
  }

  set topAlert(value: TopAlert) {
    this._topAlert$.next(value)
  }
}
