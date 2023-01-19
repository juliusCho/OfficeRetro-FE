import { Injectable } from '@angular/core'
import { CanActivate, Router } from '@angular/router'
import { AuthService } from '../services/shared/auth.service'
import { GlobalService } from '../services/shared/global.service'

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _authService: AuthService,
    private readonly _globalService: GlobalService,
    private readonly _router: Router,
  ) {}

  canActivate() {
    if (this._authService.isAuthenticated) return true

    this._globalService.toast = {
      show: true,
      type: 'alert',
      message: 'Login is required',
    }

    return this._router.navigateByUrl('login')
  }
}
