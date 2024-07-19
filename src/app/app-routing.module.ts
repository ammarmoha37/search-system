import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '@components/admin-dashboard/admin-dashboard.component';
import { LoginComponent } from '@components/login/login.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { VideoTasksComponent } from '@components/video-tasks/video-tasks.component';
import { VideosComponent } from '@components/videos/videos.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: AdminDashboard },
  { path: 'videos', component: VideosComponent },
  { path: 'researchers', component: AdminDashboard },
  { path: 'profile', component: ProfileComponent },
  { path: 'video-tasks', component: VideoTasksComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
