import { callApi } from '~Infrastructure/api-client';
import type { CrudLogFilterType, CrudLogView } from '~Infrastructure/api-types';

export function getCrudLogs(filter: CrudLogFilterType) {
  return callApi<CrudLogView[]>('/crud-logs', 'POST', JSON.stringify(filter));
}
