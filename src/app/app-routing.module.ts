import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboard } from '@components/admin-dashboard/admin-dashboard.component';
import { AdminManageComponent } from '@components/admin-manage/admin-manage.component';
import { AdminVideosComponent } from '@components/admin-videos/admin-videos.component';
import { LoginComponent } from '@components/login/login.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { ResearchersListComponent } from '@components/researchers-list/researchers-list.component';
import { VideoTasksComponent } from '@components/video-tasks/video-tasks.component';
import { VideosComponent } from '@components/videos/videos.component';
import { WelcomeComponent } from '@components/welcome/welcome.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'admin-dashboard', component: AdminDashboard },
  { path: 'login', component: LoginComponent },
  { path: 'tasks-manage', component: AdminManageComponent },
  { path: 'researcher-videos', component: VideosComponent },
  { path: 'admin-videos', component: AdminVideosComponent },
  { path: 'researchers', component: ResearchersListComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'video-tasks', component: VideoTasksComponent },
  { path: 'welcome', component: WelcomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
