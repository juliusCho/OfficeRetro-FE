import { TestBed } from '@angular/core/testing'
import { TestAutoUnsubscribeDecoratorComponent } from './auto-unsubscribe-decorator-fixtures.spec'

describe('AutoUnsubscribeDecorator', () => {
  it('all subscription properties should be unsubscribed when component is destroyed', () => {
    const fixture = TestBed.configureTestingModule({
      declarations: [TestAutoUnsubscribeDecoratorComponent],
    }).createComponent(TestAutoUnsubscribeDecoratorComponent)

    const component = fixture.componentInstance

    fixture.detectChanges()

    const firstSubscription$ = (component.firstSubscription$ as any).__proto__
      .__proto__
    const secondSubscription$ = (component.secondSubscription$ as any).__proto__
      .__proto__
    const subject$ = (component.subject$ as any).__proto__

    spyOn(firstSubscription$, 'unsubscribe')
    spyOn(subject$, 'unsubscribe')

    expect(firstSubscription$.unsubscribe).not.toHaveBeenCalled()
    expect(secondSubscription$.unsubscribe).not.toHaveBeenCalled()
    expect(subject$.unsubscribe).not.toHaveBeenCalled()

    fixture.destroy()

    expect(firstSubscription$.unsubscribe).toHaveBeenCalled()
    expect(secondSubscription$.unsubscribe).toHaveBeenCalled()
    expect(subject$.unsubscribe).toHaveBeenCalled()
  })
})
