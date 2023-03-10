import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  get token() {
    return localStorage.getItem('token') ?? ''
  }

  set token(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  get refreshToken() {
    return localStorage.getItem('refreshToken') ?? ''
  }

  set refreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue)
  }

  get isAuthenticated() {
    return !!this.token
  }

  readonly signOut = () => {
    localStorage.clear()
  }
}
