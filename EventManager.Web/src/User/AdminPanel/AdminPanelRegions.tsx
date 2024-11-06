import { type ChangeEvent, useCallback, useEffect, useState } from 'react';
import { z } from 'zod';

import {
  createRegion,
  getRegions,
  updateRegion,
} from '~Infrastructure/ApiRequests/regions-request';
import type { RegionView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { TextInput } from '~Infrastructure/components/Form/TextInput/TextInput';
import { Modal } from '~Infrastructure/components/Modal/Modal';

import './AdminPanelRegions.css';

const schema = z.object({
  regionName: z.string(),
});

export type RegionForm = z.infer<typeof schema>;

const defaultValues: RegionForm = {
  regionName: '',
};

export function AdminPanelRegions() {
  const [regions, setRegions] = useState<RegionView[]>([]);
  const [filteredRegions, setFilteredRegions] = useState<RegionView[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [submitError, setSubmitError] = useState<string | undefined>();

  const [regionIdForEdit, setRegionIdForEdit] = useState<number | undefined>();
  const [showFormModal, setShowFormModal] = useState<boolean>(false);

  const form = useZodForm({ schema });

  const closeFormModal = useCallback(() => {
    setSubmitError(undefined);
    setRegionIdForEdit(undefined);
    setShowFormModal(false);
  }, []);

  const handleShowFormModal = useCallback(
    (regionId?: number) => {
      if (regionId) {
        setRegionIdForEdit(regionId);
        const selectedRegion = filteredRegions.find(
          (x) => x.regionId === regionId
        );
        form.reset(selectedRegion);
      } else {
        form.reset(defaultValues);
      }

      setShowFormModal(true);
    },
    [filteredRegions, form]
  );

  const loadRegions = useCallback(async () => {
    const response = await getRegions();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setRegions(response.data);
    setFilteredRegions(response.data);
  }, []);

  const handleFilterNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (value) {
        const newFilteredRegions = regions.filter((x) =>
          x.regionName.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredRegions(newFilteredRegions);
      } else {
        setFilteredRegions(regions);
      }
    },
    [regions]
  );

  const handleCreateRegion = useCallback(
    async (region: RegionForm) => {
      const response = await createRegion(region);
      if (!response.success) {
        setSubmitError(response.errorMessage);
        return;
      }

      setFilteredRegions([response.data, ...regions]);
    },
    [regions]
  );

  const handleUpdateRegion = useCallback(
    async (regionId: number, region: RegionForm) => {
      const response = await updateRegion(regionId, region);
      if (!response.success) {
        setSubmitError(response.errorMessage);
        return;
      }

      const newRegions = regions.map((r) =>
        r.regionId === regionIdForEdit ? response.data : r
      );
      setFilteredRegions(newRegions);
    },
    [regionIdForEdit, regions]
  );

  const handleFormSubmit = useCallback(
    async (region: RegionForm) => {
      if (regionIdForEdit) {
        await handleUpdateRegion(regionIdForEdit, region);
      } else {
        await handleCreateRegion(region);
      }

      closeFormModal();
    },
    [closeFormModal, handleCreateRegion, handleUpdateRegion, regionIdForEdit]
  );

  useEffect(() => {
    void loadRegions();
  }, [loadRegions]);

  return (
    <div className="admin-panel-regions-wrapper mt-4">
      <div className="container">
        <div className="d-flex justify-content-end">
          <button
            type="button"
            className="btn btn-success mb-3"
            onClick={() => handleShowFormModal()}
          >
            Нов регион
          </button>
        </div>
        <TextInput
          name="filterName"
          label="Търси"
          onChange={handleFilterNameChange}
        />
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" className="col-1">
                #
              </th>
              <th scope="col">Име</th>
              <th scope="col" className="col-auto text-nowrap">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRegions.length > 0 &&
              filteredRegions.map((x) => (
                <tr key={x.regionId}>
                  <th scope="row">{x.regionId}</th>
                  <td>{x.regionName}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => handleShowFormModal(x.regionId)}
                    >
                      Редакция
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {error && <ErrorMessage error={error} />}

      {showFormModal && (
        <Modal onBackdropClick={closeFormModal}>
          <div className="region-form-wrapper container">
            <div className="card mt-4">
              <h3 className="card-header">
                {regionIdForEdit
                  ? `Редакция на регион (#${regionIdForEdit})`
                  : 'Нов регион'}
              </h3>
              <div className="card-body">
                <CustomForm form={form} onSubmit={handleFormSubmit}>
                  <CustomInput
                    label="Наименование"
                    {...form.register('regionName')}
                  />
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary w-100">
                      Запис
                    </button>
                    <button
                      type="button"
                      className="btn btn-warning w-100"
                      onClick={closeFormModal}
                    >
                      Изход
                    </button>
                  </div>
                </CustomForm>
                {submitError && <ErrorMessage error={submitError} />}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
