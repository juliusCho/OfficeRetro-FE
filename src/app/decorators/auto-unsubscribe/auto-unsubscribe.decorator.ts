export const AutoUnsubscribe = () => {
  return (constructor: any) => {
    constructor.prototype.ngOnDestroy = function () {
      for (const prop in this) {
        const ngProp = this[prop]?.__proto__
        if (typeof ngProp?.unsubscribe === 'function') {
          ngProp.unsubscribe()
        } else if (typeof ngProp?.__proto__?.unsubscribe === 'function') {
          ngProp.__proto__.unsubscribe()
        }
      }
    }
  }
}
