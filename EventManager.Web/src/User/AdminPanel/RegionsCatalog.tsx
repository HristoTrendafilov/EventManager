import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getRegions } from '~/Infrastructure/ApiRequests/regions-request';
import type { RegionView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { TextInput } from '~/Infrastructure/components/Form/TextInput/TextInput';

import { RegionModal } from './RegionModal';

interface RegionsCatalogFilter {
  regionName: string;
}

const defaultValues: RegionsCatalogFilter = {
  regionName: '',
};

export function RegionsCatalog() {
  const [regions, setRegions] = useState<RegionView[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [filter, setFilter] = useState<RegionsCatalogFilter>(defaultValues);

  const [regionIdForEdit, setRegionIdForEdit] = useState<number | undefined>();
  const [formModal, setFormModal] = useState<boolean>(false);

  const closeFormModal = useCallback(() => {
    setRegionIdForEdit(undefined);
    setFormModal(false);
  }, []);

  const showFormModal = useCallback((regionId?: number) => {
    setRegionIdForEdit(regionId);
    setFormModal(true);
  }, []);

  const loadRegions = useCallback(async () => {
    const response = await getRegions();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setRegions(response.data);
  }, []);

  const handleFilterNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFilter({ regionName: value });
    },
    []
  );

  const handleOnCreated = useCallback(
    (region: RegionView) => {
      setRegions([region, ...regions]);
      setFilter(defaultValues);
      closeFormModal();
    },
    [closeFormModal, regions]
  );

  const handleOnUpdated = useCallback(
    (region: RegionView) => {
      const newRegions = regions.map((x) =>
        x.regionId === region.regionId ? region : x
      );

      setRegions(newRegions);
      closeFormModal();
    },
    [closeFormModal, regions]
  );

  useEffect(() => {
    void loadRegions();
  }, [loadRegions]);

  const displayedRegions = useMemo(
    () =>
      regions.filter((x) =>
        filter.regionName
          ? x.regionName
              .toLowerCase()
              .startsWith(filter.regionName.toLowerCase())
          : true
      ),
    [regions, filter.regionName]
  );

  return (
    <div className="mw-700px m-50auto">
      <div className="container">
        <div className="card">
          <h4 className="card-header d-flex justify-content-between align-items-center">
            <div>Региони</div>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => showFormModal()}
            >
              Нов регион
            </button>
          </h4>
          <div className="card-body">
            <TextInput
              name="filterName"
              label="Търси"
              value={filter.regionName}
              onChange={handleFilterNameChange}
            />

            <hr />

            {displayedRegions.length > 0 ? (
              displayedRegions.map((x) => (
                <div key={x.regionId} className="card mb-2">
                  <div className="card-body p-2">
                    <div className="row align-items-center">
                      <div className="col-2 col-md-2 col-lg-1">
                        #{x.regionId}
                      </div>
                      <div className="col-5 col-md-7 col-lg-8">
                        {x.regionName}
                      </div>
                      <div className="col-5 col-md-3 col-lg-3">
                        <button
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={() => showFormModal(x.regionId)}
                        >
                          Редакция
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Няма намерени региони</p>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}

      {formModal && (
        <RegionModal
          regionId={regionIdForEdit}
          onCreated={handleOnCreated}
          onUpdated={handleOnUpdated}
          onCancel={closeFormModal}
        />
      )}
    </div>
  );
}
