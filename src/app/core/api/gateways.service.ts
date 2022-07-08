import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@app/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GatewaysService {
  constructor(private httpClient: HttpClient) {}

  list() {
    return this.httpClient
      .get(`${environment.API_URL}/gateways`)
      .pipe(map((response: any) => response.data));
  }
}
