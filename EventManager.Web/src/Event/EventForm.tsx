import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

import {
  createEvent,
  getEventForUpdate,
  getEventMainImage,
  updateEvent,
} from '~Infrastructure/ApiRequests/events-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomButtonFileInput } from '~Infrastructure/components/Form/CustomForm/CustomButtonFileInput';
import { CustomDateInput } from '~Infrastructure/components/Form/CustomForm/CustomDateInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { objectToFormData } from '~Infrastructure/utils';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';
import noImage from '~asset/no-image.png';

import './EventForm.css';

const schema = z.object({
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.coerce.date(),
  eventEndDateTime: z.coerce.date().nullable(),
  regionId: z.number(),
  mainImage: z.instanceof(File).nullable(),
  createdByUserId: z.number(),
});

type EventForm = z.infer<typeof schema>;

const defaultValues: EventForm = {
  eventName: '',
  eventDescription: null,
  eventStartDateTime: new Date(),
  eventEndDateTime: null,
  regionId: 0,
  mainImage: null,
  createdByUserId: 0,
};

export function Event() {
  const [error, setError] = useState<string | undefined>();
  const [mainImage, setMainImage] = useState<string>(noImage);

  const { eventId } = useParams();
  const navigate = useNavigate();

  const form = useZodForm({ schema });

  const loadEvent = useCallback(
    async (paramEventId: number) => {
      const eventResponse = await getEventForUpdate(paramEventId);
      if (!eventResponse.success) {
        setError(eventResponse.errorMessage);
        return;
      }

      form.reset(eventResponse.data);

      if (eventResponse.data.hasMainImage) {
        const imageResponse = await getEventMainImage(paramEventId);
        if (!imageResponse.success) {
          setError(imageResponse.errorMessage);
          return;
        }

        setMainImage(URL.createObjectURL(imageResponse.data));
      }
    },
    [form]
  );

  const onMainImageChosen = (file: File) => {
    URL.revokeObjectURL(mainImage);
    setMainImage(URL.createObjectURL(file));
    form.setValue('mainImage', file);
  };

  const handleSubmit = useCallback(
    async (event: EventForm) => {
      setError(undefined);

      const formData = objectToFormData(event);

      let response;
      if (eventId) {
        response = await updateEvent(Number(eventId), formData);
      } else {
        response = await createEvent(formData);
      }

      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      navigate(`/events/${response.data.primaryKey}/view`);
    },
    [eventId, navigate]
  );

  useEffect(() => {
    if (eventId) {
      void loadEvent(Number(eventId));
    } else {
      form.reset(defaultValues);
      setMainImage(noImage);
      setError(undefined);
    }
  }, [eventId, form, loadEvent]);

  useEffect(
    () => () => {
      URL.revokeObjectURL(mainImage);
    },
    [mainImage]
  );

  /* eslint-disable no-console */
  console.log(form.watch());
  /* eslint-enable no-console */

  return (
    <div className="event-wrapper">
      <div className="card main-card border-1 border-danger">
        <h2 className="card-header text-white bg-danger bg-gradient">
          {eventId ? 'Редакция на събитие' : 'Ново събитие'}
        </h2>

        <div className="card-body">
          <CustomForm form={form} onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <CustomInput
                  {...form.register('eventName')}
                  label="Наименование"
                  required
                />
                <CustomTextArea
                  {...form.register('eventDescription')}
                  label="Описание"
                />
                <RegionSelect
                  {...form.register('regionId')}
                  label="Регион на събитието"
                  isNumber
                  required
                />
                <CustomDateInput
                  {...form.register('eventStartDateTime')}
                  label="Начало на събитието"
                  showTime
                  required
                />
                <CustomDateInput
                  {...form.register('eventEndDateTime')}
                  label="Край на събитието"
                  showTime
                />
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header p-1 d-flex justify-content-center">
                    <CustomButtonFileInput
                      {...form.register('mainImage')}
                      label="Главна снимка"
                      onFileChosen={onMainImageChosen}
                    />
                  </div>
                  <div className="card-body p-1 main-image-wrapper">
                    <img alt="main" className="main-image" src={mainImage} />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary">
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
  );
}
