export type HttpErrorResponse = { errorMessage: string }

export type HttpResponse<T> = T | HttpErrorResponse
