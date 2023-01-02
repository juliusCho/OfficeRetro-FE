import { Component, OnInit } from '@angular/core'
import { of, Subject, Subscription } from 'rxjs'
import { AutoUnsubscribe } from './auto-unsubscribe.decorator'

@AutoUnsubscribe()
@Component({
  template: `<div></div>`,
})
export class TestAutoUnsubscribeDecoratorComponent implements OnInit {
  firstSubscription$ = new Subscription()
  secondSubscription$ = new Subscription()
  subject$ = new Subject()

  ngOnInit(): void {
    this.firstSubscription$ = of().subscribe(() => {
      this.subject$.next(undefined)
    })
    this.secondSubscription$ = of().subscribe(() => {})
  }
}
