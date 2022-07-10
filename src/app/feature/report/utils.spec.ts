import { Gateway } from '@app/api/interfaces/gateway';
import { Payment } from '@app/api/interfaces/payment';
import { Project } from '@app/api/interfaces/project';
import {
  filterWith,
  getId,
  groupBy,
  isArrayDefinedWithNull,
  isArrayDefinedWithValue,
} from './utils';

describe('Utils', () => {
  const project: Project = {
    description: 'test',
    gatewayIds: ['gateway-id'],
    projectId: 'project-id',
    userIds: ['user-id'],
    name: 'testproject',
  };

  const gateway: Gateway = {
    description: 'test',
    gatewayId: 'gateway-id',
    apiKey: 'qweerqwe',
    projectId: 'project-id',
    userIds: ['user-id'],
    type: ['type-test'],
    name: 'test-project',
  };

  const payment: Payment = {
    amount: 1,
    gatewayId: 'gateway-id',
    paymentId: 'payment-id',
    projectId: 'project-id',
    gateway,
    project,
  };

  const paymentTwo: Payment = {
    amount: 1,
    gatewayId: 'not-present-gateway',
    paymentId: 'payment-id',
    projectId: 'not-present-project',
    gateway,
    project,
  };

  it('should return the array grouped by project', () => {
    const groupByProject = groupBy('name', 'project');
    const result = groupByProject([payment]);

    expect(result).toEqual({ testproject: [payment] });
  });

  it('should match payments with projects and gateways', () => {
    const paymnentsFilteredWithGateways = filterWith([gateway], 'gatewayId');
    const paymnentsFilteredWithProjects = filterWith([project], 'projectId');
    let payments = [payment, paymentTwo];

    payments = paymnentsFilteredWithGateways(payments);
    payments = paymnentsFilteredWithProjects(payments);

    expect(payments).toEqual([payment]);
  });

  it('should retrieve the correspondent id', () => {
    const result = getId([project], 'projectId');

    expect(result).toEqual('project-id');
  });

  it('should check if array is defined with a value', () => {
    const result = isArrayDefinedWithValue(['value']);

    expect(result).toEqual('value');
  });

  it('should check if array is defined with null', () => {
    const result = isArrayDefinedWithNull([null]);

    expect(result).toEqual(true);
  });
});
