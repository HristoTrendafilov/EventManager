import { callApi } from '~Infrastructure/api-client';
import type { CrudLogView } from '~Infrastructure/api-types';
import type { CrudLogsFilter } from '~User/AdminPanel/AdminPanelCrudLogs';

export function getCrudLogs(filter: CrudLogsFilter) {
  return callApi<CrudLogView[]>('/crud-logs', 'POST', JSON.stringify(filter));
}
