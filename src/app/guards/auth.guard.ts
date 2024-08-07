import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@services/auth.service';
import { of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // return authService.loginStatus$.pipe(
  //   map((isLoggedIn) => {
  //     if (isLoggedIn) {
  //       return true;
  //     } else {
  //       router.navigate(['/unauthorized']);
  //       return false;
  //     }
  //   }),
  // );

  const localStorageUserData = localStorage.getItem('user_data');
  const userData = localStorageUserData
    ? JSON.parse(localStorageUserData)
    : null;

  console.log('User Data from localStorage:', userData); // Debugging statement

  return of(userData).pipe(
    switchMap((userData) => {
      // Check if the user is logged in
      if (!userData) {
        console.log('No user data found. Redirecting to login.'); // Debugging statement
        router.navigate(['/login']);
        return of(false); // Return an observable with false to block access
      } else {
        // Define routes accessible by admin and user
        const allowedRoutesForAdmin = [
          'admin-dashboard',
          'tasks-manage',
          'admin-videos',
          'researchers',
          'profile',
          'disabled-videos',
          'login',
        ];

        const allowedRoutesForUser = [
          'researcher-videos',
          'profile',
          'video-tasks',
          'login',
          'welcome'
        ];

        // Determine if the current route is allowed
        const currentRoute = state.url.replace('/', '');
        const userType = userData.type;

        console.log('Current Route:', currentRoute); // Debugging statement
        console.log('User Type:', userType); // Debugging statement
        console.log('Allowed Routes for Admin:', allowedRoutesForAdmin); // Debugging statement
        console.log('Allowed Routes for User:', allowedRoutesForUser); // Debugging statement

        if (userType === 3) {
          if (allowedRoutesForAdmin.includes(currentRoute)) {
            console.log('Admin access granted.'); // Debugging statement
            return of(true); // Allow access for admin
          }
        }

        if (userType === 0) {
          if (allowedRoutesForUser.includes(currentRoute)) {
            console.log('User access granted.'); // Debugging statement
            return of(true); // Allow access for user
          }
        }

        // Redirect to unauthorized page if route is not allowed
        console.log('Access denied. Redirecting to unauthorized.'); // Debugging statement
        router.navigate(['/unauthenticated']);
        return of(false); // Return an observable with false to block access
      }
    }),
  );
};
