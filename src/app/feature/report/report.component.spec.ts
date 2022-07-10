import { NO_ERRORS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { GatewaysService } from '@app/api/gateways.service';
import { Gateway } from '@app/api/interfaces/gateway';
import { Payment } from '@app/api/interfaces/payment';
import { Project } from '@app/api/interfaces/project';
import { ProjectsService } from '@app/api/projects.service';
import { ReportService } from '@app/api/report.service';
import {
  createComponentFactory,
  Spectator,
  SpyObject,
} from '@ngneat/spectator';
import { of } from 'rxjs';
import { ReportComponent } from './report.component';

describe('ReportComponent', () => {
  let spectator: Spectator<ReportComponent>;
  let projectsService: SpyObject<ProjectsService>;
  let gatewaysService: SpyObject<GatewaysService>;
  let reportService: SpyObject<ReportService>;

  const project: Project = {
    description: 'test',
    gatewayIds: ['gateway-id', 'gateway-id-2'],
    projectId: 'project-id',
    userIds: ['user-id'],
    name: 'testeProject',
  };

  const project2: Project = {
    description: 'test',
    gatewayIds: ['gateway-id'],
    projectId: 'project-id-2',
    userIds: ['user-id'],
    name: 'testeProject2',
  };

  const gateway: Gateway = {
    description: 'test',
    gatewayId: 'gateway-id',
    apiKey: 'qweerqwe',
    projectId: 'project-id',
    userIds: ['user-id'],
    type: ['type-test'],
    name: 'testeGateway',
  };

  const gateway2: Gateway = {
    description: 'test',
    gatewayId: 'gateway-id-2',
    apiKey: 'qweerqwe',
    projectId: 'project-id',
    userIds: ['user-id'],
    type: ['type-test'],
    name: 'testeGateway2',
  };

  const payment: Payment = {
    amount: 1,
    gatewayId: 'gateway-id',
    paymentId: 'payment-id',
    projectId: 'project-id',
  };

  const payment2: Payment = {
    amount: 2,
    gatewayId: 'gateway-id-2',
    paymentId: 'payment-id',
    projectId: 'project-id',
  };

  const payment3: Payment = {
    amount: 3,
    gatewayId: 'gateway-id',
    paymentId: 'payment-id',
    projectId: 'project-id-2',
  };

  const createComponent = createComponentFactory({
    component: ReportComponent,
    mocks: [ProjectsService, GatewaysService, ReportService],
    schemas: [NO_ERRORS_SCHEMA],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    projectsService = spectator.inject(ProjectsService);
    gatewaysService = spectator.inject(GatewaysService);
    reportService = spectator.inject(ReportService);
    projectsService.list.andReturn(of([project]));
    gatewaysService.list.andReturn(of([project]));
    spectator.detectChanges();
  });

  it('exists', () => {
    expect(spectator.component).toBeDefined();
  });

  it('should fetch the projects and gateways on init', () => {
    spectator.component.ngOnInit();
    expect(projectsService.list).toHaveBeenCalled();
    expect(gatewaysService.list).toHaveBeenCalled();
  });

  it('should assign the project value', () => {
    spectator.component.chooseProject(null);
    expect(spectator.component.chosenProject).toBeDefined();
    expect(spectator.component.chosenProject).toEqual([null]);
  });

  it('should assign the gateway value', () => {
    spectator.component.chooseGateway(null);
    expect(spectator.component.chosenGateway).toBeDefined();
    expect(spectator.component.chosenGateway).toEqual([null]);
  });

  it('should generate the report and transform the report', fakeAsync(() => {
    const transformSpy = spyOn(spectator.component, 'transformToReport');

    const createPayload = {
      from: '2021-01-01',
      to: '2021-12-31',
      projectId: 'project-id',
      gatewayId: 'gateway-id',
    };

    reportService.create.and.returnValue(of({}));

    spectator.component.chosenProject = [project];
    spectator.component.chosenGateway = [gateway];
    spectator.component.projects$ = of([project]);
    spectator.component.gateways$ = of([gateway]);
    spectator.component.generateReport();

    tick(1);

    expect(spectator.component.chosenGateway).toBeDefined();
    expect(spectator.component.chosenProject).toBeDefined();

    expect(reportService.create).toHaveBeenCalledWith(createPayload);

    expect(transformSpy).toHaveBeenCalled();
  }));

  it('should get the dropdown name (fancy name)', () => {
    const call = spectator.component.getDropDownName('selTest', 'allTest', [
      { name: 'fancy name' },
    ]);

    expect(call).toEqual('fancy name');
  });

  it('should get the dropdown name (allTest)', () => {
    const call = spectator.component.getDropDownName('selTest', 'allTest', [
      null,
    ]);

    expect(call).toEqual('allTest');
  });

  it('should get the dropdown name (selTest)', () => {
    const call = spectator.component.getDropDownName(
      'selTest',
      'allTest',
      undefined as any
    );

    expect(call).toEqual('selTest');
  });

  it('should map the payment correctly', () => {
    const call = spectator.component.mapPayment(
      [payment],
      [project],
      [gateway]
    );

    expect(call).toEqual([{ ...payment, gateway, project }]);
  });

  it('should transform to report corectly, 1-1', () => {
    spectator.component.chosenProject = [project];
    spectator.component.chosenGateway = [gateway];

    spectator.component.transformToReport([payment], [project], [gateway]);

    expect(spectator.component.accordionData.data$.value).toEqual({
      testeProject: [{ ...payment, project, gateway }],
    });
    expect(spectator.component.accordionData.total).toEqual(1);
  });

  it('should transform to report corectly, N-1', () => {
    spectator.component.chosenProject = [null];
    spectator.component.chosenGateway = [gateway];

    spectator.component.transformToReport(
      [payment, payment3],
      [project, project2],
      [gateway]
    );

    expect(spectator.component.accordionData.data$.value).toEqual({
      testeProject: [{ ...payment, project, gateway }],
      testeProject2: [{ ...payment3, project: { ...project2 }, gateway }],
    });
    expect(spectator.component.accordionData.total).toEqual(4);
  });

  it('should transform to report corectly, 1-N', () => {
    spectator.component.chosenProject = [project];
    spectator.component.chosenGateway = [null];

    spectator.component.transformToReport(
      [payment, payment2],
      [project],
      [gateway, gateway2]
    );

    expect(spectator.component.accordionData.data$.value).toEqual({
      testeGateway: [{ ...payment, project, gateway }],
      testeGateway2: [{ ...payment2, project, gateway: { ...gateway2 } }],
    });

    expect(spectator.component.accordionData.total).toEqual(3);
  });

  it('should transform to report corectly, N-N', () => {
    spectator.component.chosenProject = [null];
    spectator.component.chosenGateway = [null];

    spectator.component.transformToReport(
      [payment, payment2, payment3],
      [project, project2],
      [gateway, gateway2]
    );

    expect(spectator.component.accordionData.data$.value).toEqual({
      testeProject: [
        { ...payment, project, gateway },
        { ...payment2, project, gateway: { ...gateway2 } },
      ],
      testeProject2: [{ ...payment3, project: { ...project2 }, gateway }],
    });

    expect(spectator.component.accordionData.total).toEqual(6);
  });
});
