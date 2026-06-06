import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.obterToken();

  const ehLogin = req.url.includes('/auth/login');

  if (!token || ehLogin) {
    return next(req);
  }

  const requisicaoComToken = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(requisicaoComToken);
};
