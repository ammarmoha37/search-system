import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment.prod';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private http: HttpClient,
  ) {}

  getAdminData(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.apiUrl}/admin/dashboard`, { headers });
  }

  getAllVideos(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/admin/videosInfo`, { headers });
  }

  getAllResearchers(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/admin/getAllUsers`, { headers });
  }

  setNewTasks(taskData: any): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post<any>(`${this.apiUrl}/admin/setNewTasks`, taskData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  setTransferredTasks(taskData: any): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post<any>(
      `${this.apiUrl}/admin/setTransferedTasks`,
      taskData,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  getAvailableTasks(user_id: number): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post<any>(
      `${this.apiUrl}/admin/getTasksAvailable`,
      { user_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  getAllAvailableTasks(): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/admin/getDataToAddNewTask`, {
      headers,
    });
  }

  getVideoDetails(video_id: number): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post<any>(
      `${this.apiUrl}/admin/getClipsByVideoId`,
      { video_id },
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
  }

  cutVideo(cutVideoData: any): Observable<any> {
    const token = this.authService.getToken();
    return this.http.post<any>(`${this.apiUrl}/admin/cutVideo`, cutVideoData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  userEditInfo(userInfo: any): Observable<any> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      `${this.apiUrl}/admin/AdminEditUserInfo`,
      userInfo,
      {
        headers,
      },
    );
  }

  updateVideoData(videoData: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      `${this.apiUrl}/admin/AdminUpdateVideoClips`,
      videoData,
      {
        headers,
      },
    );
  }

  disableVideo(video_key: any) {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(
      `${this.apiUrl}/admin/disableVideo`,
      { video_key },
      {
        headers,
      },
    );
  }

  getAllDisabledVideos(): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/admin/getALlDisablededVideos`, {
      headers,
    });
  }

  enabledVideos(video_key: any): Observable<any[]> {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any[]>(`${this.apiUrl}/admin/enableVideo`, {video_key}, {
      headers,
    });
  }
}
