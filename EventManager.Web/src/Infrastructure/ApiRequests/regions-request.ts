import { callApi } from '~Infrastructure/api-client';
import type { RegionView } from '~Infrastructure/api-types';

export function getRegions() {
  return callApi<RegionView[]>('/regions', 'GET');
}
