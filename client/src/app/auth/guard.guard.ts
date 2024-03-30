import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { GeneralService } from '../services/general.service';

export const guardGuard: CanActivateFn = (route, state) => {
  const generalService = inject(GeneralService);
  const jwtToken = generalService.getToken();
  if (!jwtToken) {
    generalService.logOutUser;
    return false;
  }
  return true;
};
