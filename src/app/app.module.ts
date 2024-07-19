import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CsrfInterceptor } from './interceptors/csrf.interceptor';

import { VideosTasksService } from '@services/videos-tasks.service';
import { UsersService } from '@services/users.service';
import { AuthService } from '@services/auth.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboard } from '@components/admin-dashboard/admin-dashboard.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { LoginComponent } from '@components/login/login.component';
import { VideoTasksComponent } from '@components/video-tasks/video-tasks.component';
import { ProfileComponent } from '@components/profile/profile.component';
import { TaskStatisticsComponent } from '@components/task-statistics/task-statistics.component';
import { SubmissionNotificationsComponent } from '@components/video-tasks/submission-notifications/submission-notifications.component';
import { VideosComponent } from './components/videos/videos.component';
import { PaginationComponent } from './components/pagination/pagination.component';

@NgModule({
  declarations: [
    AppComponent,
    AdminDashboard,
    SidebarComponent,
    LoginComponent,
    VideoTasksComponent,
    ProfileComponent,
    TaskStatisticsComponent,
    SubmissionNotificationsComponent,
    VideosComponent,
    PaginationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    UsersService,
    VideosTasksService,
    { provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
