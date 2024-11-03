import { callApi } from '~Infrastructure/api-client';
import type { RegionView } from '~Infrastructure/api-types';
import type { RegionForm } from '~User/AdminPanel/AdminPanelRegions';

export function getRegions() {
  return callApi<RegionView[]>('/regions', 'GET');
}

export function updateRegion(regionId: number, region: RegionForm) {
  return callApi<RegionView>(
    `/regions/${regionId}/update`,
    'PUT',
    JSON.stringify(region)
  );
}

export function createRegion(region: RegionForm) {
  return callApi<RegionView>('/regions/new', 'POST', JSON.stringify(region));
}
