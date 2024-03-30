import { CanActivateFn } from '@angular/router';

export const guardGuard: CanActivateFn = (route, state) => {
  return true;
};
