import { environment } from '@app/environment';
import { ProjectsService } from './projects.service';

import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator';

describe('ProjectsService', () => {
  let spectator: SpectatorHttp<ProjectsService>;

  const createHttp = createHttpFactory({
    service: ProjectsService,
  });

  beforeEach(() => (spectator = createHttp()));

  it('exists', () => {
    expect(spectator.service).toBeDefined();
  });

  it('should get the projects', () => {
    spectator.service.list().subscribe();

    const request = spectator.expectOne(
      environment.API_URL + '/projects',
      HttpMethod.GET
    );

    request.flush({});
  });
});
