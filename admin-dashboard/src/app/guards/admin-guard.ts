import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { Auth } from '../Services/auth';
import { Iuser } from '../Models/iuser';
import { ToastrService } from 'ngx-toastr';

export const adminGuard: CanActivateChildFn = (route, state) => {

  const authService = inject(Auth);
  const router = inject(Router);
  const toastr = inject(ToastrService);

  const user: Iuser | null = authService.getUser();

  if (user && user.role === 'admin') {
    return true;
  }

    toastr.error(
    'You are not allowed to access the control panel',
    'Access Denied'
  );
  router.navigate(['/login']);
  return false;
};