import { useCallback, useEffect, useState } from 'react';

import {
  createOrganization,
  getOrganizationForUpdate,
  updateOrganization,
} from '~/Infrastructure/ApiRequests/organizations-requests';
import {
  OrganizationBaseFormSchema,
  type OrganizationBaseFormType,
  type OrganizationView,
} from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomFileInputButton } from '~/Infrastructure/components/Form/CustomForm/CustomFileInputButton';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~/Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { FileInputTypeEnum } from '~/Infrastructure/components/Form/formUtils';
import { Modal } from '~/Infrastructure/components/Modal/Modal';
import { objectToFormData, urlToFileList } from '~/Infrastructure/utils';
import noImage from '~/asset/no-image.png';

interface OrganizationFormModalProps {
  organizationId: number | undefined;
  onCreated: (organization: OrganizationView) => void;
  onUpdated: (organization: OrganizationView) => void;
  onCancel: () => void;
}

export function OrganizationFormModal(props: OrganizationFormModalProps) {
  const { organizationId, onCreated, onUpdated, onCancel } = props;
  const [error, setError] = useState<string | undefined>();
  const [logo, setLogo] = useState<string>(noImage);

  const { form } = useZodForm({
    schema: OrganizationBaseFormSchema,
  });

  const handleFormSubmit = useCallback(
    async (organization: OrganizationBaseFormType) => {
      const formData = objectToFormData(organization);
      let response;
      if (organizationId) {
        response = await updateOrganization(organizationId, formData);
      } else {
        response = await createOrganization(formData);
      }

      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      if (organizationId) {
        onUpdated(response.data);
      } else {
        onCreated(response.data);
      }
    },
    [onCreated, onUpdated, organizationId]
  );

  const onLogoChosen = (file: File) => {
    if (logo) {
      URL.revokeObjectURL(logo);
    }

    setLogo(URL.createObjectURL(file));
  };

  const loadOrganization = useCallback(
    async (paramOrganizationId: number) => {
      const response = await getOrganizationForUpdate(paramOrganizationId);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      form.reset(response.data);
      setLogo(response.data.organizationLogoUrl);
      const fileList = await urlToFileList(response.data.organizationLogoUrl);
      form.setValue('organizationLogoFile', fileList);
    },
    [form]
  );

  useEffect(() => {
    if (organizationId) {
      void loadOrganization(organizationId);
    }
  }, [loadOrganization, organizationId]);

  return (
    <Modal onBackdropClick={onCancel}>
      <div className="container">
        <div className="mw-700px m-70auto">
          <div className="card mt-4">
            <h3 className="card-header">
              {organizationId
                ? `Редакция на организация (#${organizationId})`
                : 'Нова организация'}
            </h3>
            <div className="card-body">
              <CustomForm form={form} onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <CustomInput
                      label="Наименование"
                      {...form.register('organizationName')}
                      required
                    />
                    <CustomTextArea
                      label="Описание"
                      {...form.register('organizationDescription')}
                      rows={5}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header p-1 d-flex justify-content-center">
                        <CustomFileInputButton
                          {...form.register('organizationLogoFile')}
                          label="Избери лого"
                          fileType={FileInputTypeEnum.Images}
                          onFileChosen={onLogoChosen}
                        />
                      </div>
                      <div className="card-body p-1 main-image-wrapper">
                        <img
                          alt="main"
                          className="w-100 object-fit-contain"
                          src={logo}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 mt-2">
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
