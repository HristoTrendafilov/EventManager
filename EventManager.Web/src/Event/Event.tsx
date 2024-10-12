import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { z } from 'zod';

import {
  createEvent,
  getEvent,
  getEventMainImage,
  updateEvent,
} from '~Infrastructure/api-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomButtonFileInput } from '~Infrastructure/components/Form/CustomForm/CustomButtonFileInput';
import { CustomDateInput } from '~Infrastructure/components/Form/CustomForm/CustomDateInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { getClientErrorMessage, objectToFormData } from '~Infrastructure/utils';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';

import './Event.css';

const schema = z.object({
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.coerce.date(),
  eventEndDateTime: z.coerce.date().nullable(),
  regionId: z.number(),
  mainImage: z.instanceof(FileList).nullable(),
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
  const [mainImage, setMainImage] = useState<string | undefined>();

  const { eventId } = useParams();

  const form = useZodForm({ schema });

  const loadEvent = useCallback(
    async (paramEventId: number) => {
      try {
        const eventDto = await getEvent(paramEventId);
        form.reset(eventDto);

        const eventMainImage = await getEventMainImage(paramEventId);
        setMainImage(URL.createObjectURL(eventMainImage));
      } catch (err) {
        setError(getClientErrorMessage(err));
      }
    },
    [form]
  );

  useEffect(() => {
    if (eventId) {
      void loadEvent(Number(eventId));
    } else {
      form.reset(defaultValues);
      setMainImage(undefined);
    }
  }, [eventId, loadEvent, form]);

  const onMainImageChosen = (file: File) => {
    setMainImage(URL.createObjectURL(file));
  };

  const handleSubmit = useCallback(
    async (event: EventForm) => {
      setError(undefined);

      try {
        const formData = objectToFormData(event);
        if (eventId) {
          await updateEvent(Number(eventId), formData);
        } else {
          await createEvent(formData);
        }
      } catch (err) {
        setError(getClientErrorMessage(err));
      }
    },
    [eventId]
  );

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
                    {mainImage && (
                      <img alt="main" className="main-image" src={mainImage} />
                    )}
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
