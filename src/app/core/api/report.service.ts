import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  constructor(private httpClient: HttpClient) {}

  create(payload: any) {
    return this.httpClient
      .post(`${environment.API_URL}/report`, payload)
      .pipe(map((response: any) => response.data));
  }
}
