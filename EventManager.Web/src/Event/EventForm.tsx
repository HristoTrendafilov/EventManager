import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';

import { createEvent, getEventForUpdate, updateEvent } from '~/Infrastructure/ApiRequests/events-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import { EventBaseFormSchema, type EventBaseFormType } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomDateInput } from '~/Infrastructure/components/Form/CustomForm/CustomDateInput';
import { CustomFileInputButton } from '~/Infrastructure/components/Form/CustomForm/CustomFileInputButton';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~/Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { FileInputTypeEnum, setValidationErrors } from '~/Infrastructure/components/Form/formUtils';
import { userSelector } from '~/Infrastructure/redux/user-slice';
import { objectToFormData } from '~/Infrastructure/utils';
import { OrganizationSelect } from '~/Shared/SmartSelects/Organization/OrganizationSelect';
import { RegionSelect } from '~/Shared/SmartSelects/Region/RegionSelect';
import noImage from '~/asset/no-image.png';

import './EventForm.css';

export function Event() {
  const [error, setError] = useState<string | undefined>();
  const [mainImage, setMainImage] = useState<string>(noImage);

  const { eventId } = useParams();
  const navigate = useNavigate();

  const { form } = useZodForm({
    schema: EventBaseFormSchema,
    defaultValues: { regionId: 0, organizationId: 0 },
  });

  const user = useSelector(userSelector);

  const loadEvent = useCallback(
    async (paramEventId: number) => {
      const eventResponse = await getEventForUpdate(paramEventId);
      if (!eventResponse.success) {
        setError(eventResponse.errorMessage);
        return;
      }

      setMainImage(eventResponse.data.mainImageUrl);
      form.reset(eventResponse.data);
    },
    [form]
  );

  const onMainImageChosen = (file: File) => {
    if (mainImage) {
      URL.revokeObjectURL(mainImage);
    }

    setMainImage(URL.createObjectURL(file));
  };

  const handleSubmit = useCallback(
    async (event: EventBaseFormType) => {
      setError(undefined);

      const formData = objectToFormData(event);

      let response;
      if (eventId) {
        response = await updateEvent(Number(eventId), formData);
      } else {
        response = await createEvent(formData);
      }

      if (!response.success) {
        if (response.hasValidationErrors) {
          setValidationErrors(response.validationPropertyErrors, form.setError);
        } else {
          setError(response.errorMessage);
        }

        return;
      }

      navigate(CustomRoutes.eventsView(response.data.primaryKey));
    },
    [eventId, form.setError, navigate]
  );

  useEffect(() => {
    if (eventId) {
      void loadEvent(Number(eventId));
    }
  }, [eventId, loadEvent]);

  useEffect(
    () => () => {
      if (mainImage) {
        URL.revokeObjectURL(mainImage);
      }
    },
    [mainImage]
  );

  return (
    <div className="event-wrapper">
      <div className="container">
        <div className="mw-800px m-50auto">
          <div className="card shadow _primary-border">
            <h3 className="card-header _primary-bg-gradient-color text-white">
              {eventId ? `Редакция на събитие (#${eventId})` : 'Ново събитие'}
            </h3>

            <div className="card-body">
              <CustomForm form={form} onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <CustomInput {...form.register('eventName')} label="Наименование" addAsterisk />
                    <RegionSelect
                      {...form.register('regionId')}
                      label="Регион на събитието"
                      isNumber
                      addAsterisk
                      searchable={false}
                      clearable={false}
                    />
                    <OrganizationSelect
                      {...form.register('organizationId')}
                      userId={user.userId}
                      label="Организация"
                      isNumber
                      addAsterisk
                      setDefaultUserOrganization
                      searchable={false}
                      clearable={false}
                    />
                    <CustomDateInput
                      {...form.register('eventStartDateTime')}
                      label="Начало на събитието"
                      showTime
                      addAsterisk
                    />
                    <CustomDateInput
                      {...form.register('eventEndDateTime')}
                      label="Край на събитието"
                      showTime
                      nullable
                    />
                    <CustomTextArea {...form.register('eventDescription')} label="Описание" rows={8} />
                  </div>
                  <div className="col-md-6">
                    <div className="card">
                      <div className="card-header p-1 d-flex justify-content-center">
                        <CustomFileInputButton
                          {...form.register('mainImage')}
                          label="Главна снимка"
                          fileType={FileInputTypeEnum.Images}
                          onFileChosen={onMainImageChosen}
                        />
                      </div>
                      <div className="card-body p-1 main-image-wrapper">
                        <img alt="main" className="w-100 object-fit-contain" src={mainImage} />
                      </div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <button type="submit" className="btn btn-primary w-100">
                      {eventId ? 'Обнови' : 'Създай'}
                    </button>
                  </div>
                </div>
              </CustomForm>
            </div>
            {error && (
              <div className="card-footer">
                <ErrorMessage error={error} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
