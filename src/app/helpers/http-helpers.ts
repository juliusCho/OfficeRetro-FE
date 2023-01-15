import {
  HttpErrorResponse,
  HttpResponse,
} from '../models/client-specs/shared/http-specs'
import { TopAlert } from '../models/client-specs/shared/ui-specs'

export const isHttpError = <T>(
  response: HttpResponse<T>,
): response is HttpErrorResponse => {
  return response && typeof response === 'object' && 'errorMessage' in response
}

export const getTopAlertForHttpError = (
  response: HttpErrorResponse,
): TopAlert => ({
  show: true,
  type: 'alert',
  message: response.errorMessage,
})
