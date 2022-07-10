import { environment } from '@app/environment';
import { ReportService } from './report.service';

import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

describe('ReportService', () => {
  let spectator: SpectatorHttp<ReportService>;

  const createHttp = createHttpFactory({
    service: ReportService,
  });

  beforeEach(() => (spectator = createHttp()));

  it('exists', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should generate the report', () => {
    const payload = {
      from: '2021-01-01',
      to: '2021-12-31',
      projectId: '',
      gatewayId: '',
    };

    spectator.service.create(payload).subscribe();

    const request = spectator.expectOne(
      environment.API_URL + '/report',
      HttpMethod.POST
    );

    request.flush({});
  });
});
