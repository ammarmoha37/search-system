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
import { SheetComponent } from './components/video-tasks/sheet/sheet.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AdminManageComponent } from './components/admin-manage/admin-manage.component';
import { AdminVideosComponent } from './components/admin-videos/admin-videos.component';
import { ResearchersListComponent } from './components/researchers-list/researchers-list.component';
import { RegisterComponent } from './components/researchers-list/register/register.component';
import { AddTasksComponent } from './components/add-tasks/add-tasks.component';
import { EditTasksComponent } from './components/edit-tasks/edit-tasks.component';
import { ClippingTasksComponent } from '@components/admin-videos/clipping-tasks/clipping-tasks.component';
import { ChartComponent } from './components/admin-dashboard/chart/chart.component';
import { EditUserComponent } from './components/researchers-list/edit-user/edit-user.component';

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
    SheetComponent,
    WelcomeComponent,
    AdminManageComponent,
    AdminVideosComponent,
    ResearchersListComponent,
    RegisterComponent,
    AddTasksComponent,
    EditTasksComponent,
    ClippingTasksComponent,
    ChartComponent,
    EditUserComponent,
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
