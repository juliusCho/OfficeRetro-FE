import { AfterContentInit, Component } from '@angular/core'

@Component({
  template: '',
})
export class BasePageComponent implements AfterContentInit {
  protected isPageLoaded = false
  protected isLoading = true

  ngAfterContentInit(): void {
    this.isPageLoaded = true
  }
}
