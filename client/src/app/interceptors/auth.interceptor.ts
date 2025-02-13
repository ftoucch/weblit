import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { GeneralService } from '../services/general.service';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const generalService = inject(GeneralService);
  const apiToken = generalService.getToken();
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${apiToken}`,
    },
  });
  return next(authReq).pipe(
    catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          generalService.logOutUser();
          return throwError(
            'Your session has expired. Please login to continue.'
          );
        }
        if (err.status === 403) {
          generalService.logOutUser();
          return throwError('You are not authorised.');
        }

        if (err.status == 500) {
          return throwError(
            'An expected error occured. Please try again later.'
          );
        }
      } else {
        console.error('An error occurred:', err);
      }
      return throwError(() => err);
    })
  );
};
