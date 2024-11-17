import { callApi } from '~Infrastructure/api-client';
import type { RegionBaseFormType, RegionView } from '~Infrastructure/api-types';

export function getRegions() {
  return callApi<RegionView[]>('/regions', 'GET');
}

export function getRegionView(regionId: number) {
  return callApi<RegionView>(`/regions/${regionId}/view`, 'GET');
}

export function updateRegion(regionId: number, region: RegionBaseFormType) {
  return callApi<RegionView>(
    `/regions/${regionId}/update`,
    'PUT',
    JSON.stringify(region)
  );
}

export function createRegion(region: RegionBaseFormType) {
  return callApi<RegionView>('/regions/new', 'POST', JSON.stringify(region));
}
