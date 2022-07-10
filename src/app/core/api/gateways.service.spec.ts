import { environment } from '@app/environment';
import { GatewaysService } from './gateways.service';

import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

describe('GatewaysService', () => {
  let spectator: SpectatorHttp<GatewaysService>;

  const createHttp = createHttpFactory({
    service: GatewaysService,
  });

  beforeEach(() => (spectator = createHttp()));

  it('exists', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should get the gateways', () => {
    spectator.service.list().subscribe();

    const request = spectator.expectOne(
      environment.API_URL + '/gateways',
      HttpMethod.GET
    );

    request.flush({});
  });
});
