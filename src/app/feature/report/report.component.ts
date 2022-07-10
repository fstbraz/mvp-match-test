import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GatewaysService } from '@app/api/gateways.service';
import { Gateway } from '@app/api/interfaces/gateway';
import { Payment } from '@app/api/interfaces/payment';
import { Project } from '@app/api/interfaces/project';
import { ProjectsService } from '@app/api/projects.service';
import { ReportService } from '@app/api/report.service';
import { AccordionData } from '@app/ui-lib/accordion/accordion.component';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';
import {
  filterWith,
  getId,
  groupBy,
  isArrayDefinedWithNull,
  isArrayDefinedWithValue,
} from './utils';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  projects$!: Observable<Project[]>;
  gateways$!: Observable<Gateway[]>;
  payments!: Payment[];
  accordionData = new AccordionData(new BehaviorSubject({}), 0);

  chosenProject!: [Project | null];
  chosenGateway!: [Gateway | null];

  @ViewChild('allAllFilter', { read: TemplateRef, static: true })
  allAllFilter!: TemplateRef<any>;

  @ViewChild('otherFilters', { read: TemplateRef, static: true })
  otherFilters!: TemplateRef<any>;

  tableTemplate!: TemplateRef<any>;

  constructor(
    private projectsService: ProjectsService,
    private gatewaysService: GatewaysService,
    private reportService: ReportService
  ) {}

  ngOnInit() {
    this.projects$ = this.projectsService.list();
    this.gateways$ = this.gatewaysService.list();
  }

  chooseProject(project: Project | null) {
    this.chosenProject = [project];
  }

  chooseGateway(gateway: Gateway | null) {
    this.chosenGateway = [gateway];
  }

  generateReport() {
    const projectId = getId(this.chosenProject, 'projectId');
    const gatewayId = getId(this.chosenGateway, 'gatewayId');

    const report$ = this.reportService
      .create({
        from: '2021-01-01',
        to: '2021-12-31',
        projectId,
        gatewayId,
      })
      .pipe(withLatestFrom(this.projects$, this.gateways$), take(1));

    report$.subscribe(([payments, projects, gateways]) => {
      this.transformToReport(payments, projects, gateways);
    });
  }

  getDropDownName(selectText: string, allText: string, selected: any[]) {
    if (isArrayDefinedWithValue(selected) && selected.length > 0) {
      return selected[0].name;
    }

    if (isArrayDefinedWithNull(selected)) {
      return allText;
    }

    if (selected === undefined) {
      return selectText;
    }
  }

  mapPayment(payments: Payment[], projects: Project[], gateways: Gateway[]) {
    return payments.map((payment) => {
      const gateway = gateways.find(
        (gateway) => gateway.gatewayId === payment?.gatewayId
      );
      const project = projects.find(
        (project) => project.projectId === payment?.projectId
      );
      return { ...payment, gateway, project };
    });
  }

  transformToReport(
    payments: Payment[],
    projects: Project[],
    gateways: Gateway[]
  ) {
    const paymnentsFilteredWithGateways = filterWith(
      isArrayDefinedWithValue(this.chosenGateway)
        ? this.chosenGateway
        : gateways,
      'gatewayId'
    );
    payments = paymnentsFilteredWithGateways(payments);

    const paymnentsFilteredWithProjects = filterWith(
      isArrayDefinedWithValue(this.chosenProject)
        ? this.chosenProject
        : projects,
      'projectId'
    );

    payments = paymnentsFilteredWithProjects(payments);

    payments = this.mapPayment(payments, projects, gateways);

    this.accordionData.total = payments.reduce(
      (prev: number, currObj: any) => prev + currObj.amount,
      0
    );

    if (
      (isArrayDefinedWithNull(this.chosenGateway) &&
        isArrayDefinedWithNull(this.chosenProject)) ||
      (!this.chosenProject && !this.chosenProject)
    ) {
      this.tableTemplate = this.allAllFilter;
    } else {
      this.tableTemplate = this.otherFilters;
    }

    if (
      (isArrayDefinedWithValue(this.chosenGateway) &&
        this.chosenGateway.length > 1 &&
        isArrayDefinedWithValue(this.chosenProject) &&
        this.chosenProject.length === 1) ||
      (isArrayDefinedWithValue(this.chosenProject) &&
        this.chosenProject.length === 1 &&
        isArrayDefinedWithNull(this.chosenGateway))
    ) {
      const groupByGateway = groupBy('name', 'gateway');
      payments = groupByGateway(payments);
    } else {
      const groupByProject = groupBy('name', 'project');
      payments = groupByProject(payments);
    }

    this.accordionData.data$.next(payments);
  }
}
