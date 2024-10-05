import { useCallback, useState } from 'react';
import { z } from 'zod';

import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomDateInput } from '~Infrastructure/components/Form/CustomForm/CustomDateInput';
import { CustomFileInput } from '~Infrastructure/components/Form/CustomForm/CustomFileInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { getClientErrorMessage } from '~Infrastructure/utils';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';

import './Event.css';

const schema = z.object({
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.date(),
  eventEndDateTime: z.date().nullable(),
  regionId: z.number(),
  image: z.instanceof(FileList),
});

type Test = z.infer<typeof schema>;

export function Event() {
  const [error, setError] = useState<string>();

  const handleLogin = useCallback((data: Test) => {
    setError(undefined);

    try {
      /* eslint-disable no-console */
      console.log(data);
      /* eslint-enable no-console */
    } catch (err) {
      setError(getClientErrorMessage(err));
    }
  }, []);

  const form = useZodForm({ schema });

  return (
    <div className="event-wrapper">
      <div className="card border-1 border-danger">
        <h2 className="card-header text-white bg-danger bg-gradient">
          Ново събитие
        </h2>

        <div className="card-body">
          <div className="row">
            <CustomForm form={form} onSubmit={handleLogin}>
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
                {/* <input type="file" {...form.register('image')} /> */}
                <CustomFileInput
                  {...form.register('image')}
                  label="Главна снимка"
                />
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Създай
                  </button>
                </div>
              </div>
            </CustomForm>
          </div>
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
