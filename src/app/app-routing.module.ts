import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '@components/admin-dashboard/admin-dashboard.component';
import { AdminManageComponent } from '@components/admin-manage/admin-manage.component';
import { AdminVideosComponent } from '@components/admin-videos/admin-videos.component';
import { DisabledVideosComponent } from '@components/admin-videos/disabled-videos/disabled-videos.component';
import { LoginComponent } from '@components/login/login.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { ResearchersListComponent } from '@components/researchers-list/researchers-list.component';
import { VideoTasksComponent } from '@components/video-tasks/video-tasks.component';
import { VideosComponent } from '@components/videos/videos.component';
import { WelcomeComponent } from '@components/welcome/welcome.component';
import { authGuard } from './guards/auth.guard';
import { UnauthorizedComponent } from '@components/unauthorized/unauthorized.component';
import { UnauthenticatedComponent } from '@components/unauthenticated/unauthenticated.component';

// const routes: Routes = [
//   { path: '', redirectTo: '/login', pathMatch: 'full' },
//   {
//     path: 'admin-dashboard',
//     component: AdminDashboard
//   },
//   { path: 'login', component: LoginComponent },
//   {
//     path: 'tasks-manage',
//     component: AdminManageComponent
//   },
//   {
//     path: 'researcher-videos',
//     component: VideosComponent
//   },
//   {
//     path: 'admin-videos',
//     component: AdminVideosComponent
//   },
//   {
//     path: 'researchers',
//     component: ResearchersListComponent
//   },
//   { path: 'profile', component: ProfileComponent },
//   {
//     path: 'video-tasks',
//     component: VideoTasksComponent
//   },
//   { path: 'welcome', component: WelcomeComponent},
//   {
//     path: 'disabled-videos',
//     component: DisabledVideosComponent
//   },
// ];


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [authGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'tasks-manage',
    component: AdminManageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'researcher-videos',
    component: VideosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-videos',
    component: AdminVideosComponent,
    canActivate: [authGuard],
  },
  {
    path: 'researchers',
    component: ResearchersListComponent,
    canActivate: [authGuard],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  {
    path: 'video-tasks',
    component: VideoTasksComponent,
    canActivate: [authGuard],
  },
  { path: 'welcome', component: WelcomeComponent, canActivate: [authGuard] },
  {
    path: 'disabled-videos',
    component: DisabledVideosComponent,
    canActivate: [authGuard],
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'unauthenticated', component: UnauthenticatedComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
