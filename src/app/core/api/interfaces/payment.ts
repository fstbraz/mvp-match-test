import { Gateway } from '@app/api/interfaces/gateway';
import { Project } from '@app/api/interfaces/project';

export interface Payment {
  amount: number;
  gatewayId: string;
  paymentId: string;
  projectId: string;
  gateway?: Gateway;
  project?: Project;
}
