import { AfterContentInit, Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  template: ``,
})
export class BasePageComponent implements AfterContentInit {
  isPageLoaded = false
  isLoading = false

  constructor(private readonly router: Router) {}

  ngAfterContentInit(): void {
    this.isPageLoaded = true
  }
}
