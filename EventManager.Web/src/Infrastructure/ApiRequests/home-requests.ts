import { callApi } from '~Infrastructure/api-client';
import type { HomeView } from '~Infrastructure/api-types';

export function getHomeView() {
  return callApi<HomeView>(`/home`, 'GET');
}
