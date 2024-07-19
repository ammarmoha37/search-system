// csrf.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const csrfToken = this.getCsrfToken(); // Get CSRF token from wherever it's stored

    if (csrfToken) {
      req = req.clone({
        setHeaders: {
          'X-CSRF-TOKEN': csrfToken,
        },
      });
    }

    return next.handle(req);
  }

  private getCsrfToken(): string | null {
    const tokenMetaTag = document.querySelector('meta[name="csrf-token"]');
    return tokenMetaTag ? tokenMetaTag.getAttribute('content') : null;
  }
}
