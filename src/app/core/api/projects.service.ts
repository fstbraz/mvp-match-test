import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { map, Observable } from 'rxjs';
import { Project } from './interfaces/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectsService {
  constructor(private httpClient: HttpClient) {}

  list(): Observable<Project[]> {
    return this.httpClient
      .get<Project[]>(`${environment.API_URL}/projects`)
      .pipe(map((response: any) => response.data));
  }
}
