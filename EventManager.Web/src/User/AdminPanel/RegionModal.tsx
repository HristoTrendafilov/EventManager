import { useCallback, useEffect, useState } from 'react';

import {
  createRegion,
  getRegionForUpdate,
  updateRegion,
} from '~/Infrastructure/ApiRequests/regions-request';
import {
  RegionBaseFormSchema,
  type RegionBaseFormType,
  type RegionView,
} from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { Modal } from '~/Infrastructure/components/Modal/Modal';

interface RegionModalProps {
  regionId: number | undefined;
  onCreated: (region: RegionView) => void;
  onUpdated: (region: RegionView) => void;
  onCancel: () => void;
}

export function RegionModal(props: RegionModalProps) {
  const { regionId, onCreated, onUpdated, onCancel } = props;

  const [error, setError] = useState<string | undefined>();

  const { form } = useZodForm({
    schema: RegionBaseFormSchema,
  });

  const handleFormSubmit = useCallback(
    async (regionForm: RegionBaseFormType) => {
      let response;
      if (regionId) {
        response = await updateRegion(regionId, regionForm);
      } else {
        response = await createRegion(regionForm);
      }

      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      if (regionId) {
        onUpdated(response.data);
      } else {
        onCreated(response.data);
      }
    },
    [onCreated, onUpdated, regionId]
  );

  const loadRegion = useCallback(
    async (paramRegionId: number) => {
      const response = await getRegionForUpdate(paramRegionId);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      form.reset(response.data);
    },
    [form]
  );

  useEffect(() => {
    if (regionId) {
      void loadRegion(regionId);
    }
  }, [loadRegion, regionId]);

  return (
    <Modal onBackdropClick={onCancel}>
      <div className="container">
        <div className="mw-500px m-70auto">
          <div className="card mt-4">
            <h3 className="card-header">
              {regionId ? `Редакция на регион (#${regionId})` : 'Нов регион'}
            </h3>
            <div className="card-body">
              <CustomForm form={form} onSubmit={handleFormSubmit}>
                <CustomInput
                  label="Наименование"
                  {...form.register('regionName')}
                  required
                />
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-warning w-100"
                    onClick={onCancel}
                  >
                    Изход
                  </button>
                  <button type="submit" className="btn btn-primary w-100">
                    Запис
                  </button>
                </div>
              </CustomForm>
              {error && <ErrorMessage error={error} />}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
