import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { z } from 'zod';

import {
  createEvent,
  getEvent,
  updateEvent,
} from '~Infrastructure/api-requests';
import type { EventDto } from '~Infrastructure/api-types';
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
  eventId: z.number(),
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.date(),
  eventEndDateTime: z.date().nullable(),
  regionId: z.number(),
  createdByUserId: z.number(),
  image: z.instanceof(FileList).nullable(),
}) satisfies z.ZodType<EventDto>;

const defaultEvent: EventDto = {
  eventId: 0,
  eventName: '',
  eventDescription: null,
  eventStartDateTime: new Date(),
  eventEndDateTime: null,
  regionId: 0,
  createdByUserId: 0,
  image: undefined,
};

export function Event() {
  const [error, setError] = useState<string | undefined>();
  const [mainImage, setMainImage] = useState<string | undefined>();

  const { eventId } = useParams();

  const form = useZodForm({
    schema,
    defaultValues: defaultEvent,
  });

  const loadEvent = useCallback(
    async (paramEventId: number) => {
      try {
        const eventDto = await getEvent(paramEventId);
        eventDto.eventStartDateTime = new Date(eventDto.eventStartDateTime);
        form.reset(eventDto);
      } catch (err) {
        setError(getClientErrorMessage(err));
      }
    },
    [form]
  );

  useEffect(() => {
    if (eventId) {
      void loadEvent(Number(eventId));
    }
  }, [eventId, loadEvent]);

  const onMainImageChosen = (file: File) => {
    setMainImage(URL.createObjectURL(file));
  };

  const handleSubmit = useCallback(
    async (eventDto: EventDto) => {
      setError(undefined);

      try {
        const formData = objectToFormData(eventDto);
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

  /* eslint-disable no-console */
  console.log(form.watch());
  /* eslint-enable no-console */

  return (
    <div className="event-wrapper">
      <div className="card main-card border-1 border-danger">
        <h2 className="card-header text-white bg-danger bg-gradient">
          Ново събитие
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
                  required
                />
                <CustomDateInput
                  {...form.register('eventEndDateTime')}
                  label="Край на събитието"
                />
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header p-1 d-flex justify-content-center">
                    <CustomButtonFileInput
                      {...form.register('image')}
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
                  Създай
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
