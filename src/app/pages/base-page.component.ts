import { AfterViewInit, Component } from '@angular/core'

@Component({
  template: '',
})
export class BasePageComponent implements AfterViewInit {
  protected isPageLoaded = false
  protected isLoading = true

  ngAfterViewInit(): void {
    this.isPageLoaded = true
  }
}
