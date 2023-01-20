export type LoginInfo = {
  email: string
  password: string
}

export type TokenInfo = {
  accessToken: string
  refreshToken: string
}

export type SignupInfo = LoginInfo & {
  firstName: string
  lastName: string
}
