import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { getCrudLogs } from '~Infrastructure/ApiRequests/crud-logs-requests';
import type { CrudLogView } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomDateInput } from '~Infrastructure/components/Form/CustomForm/CustomDateInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomSelect } from '~Infrastructure/components/Form/CustomForm/CustomSelect';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import type { SelectInputOption } from '~Infrastructure/components/Form/SelectInput/selectInputUtils';
import { formatDateTime } from '~Infrastructure/utils';

const accordionBackColor = new Map<number, string>([
  [1, 'success'],
  [2, 'primary'],
  [3, 'danger'],
]);

const schema = z.object({
  actionDateTime: z.date(),
  actionType: z.number(),
});

export type CrudLogsFilter = z.infer<typeof schema>;

const crudLogSelectOptions: SelectInputOption[] = [
  { value: '0', label: 'Всички' },
  { value: '1', label: 'Създаване' },
  { value: '2', label: 'Редакция' },
  { value: '3', label: 'Изтриване' },
];

const defaultValues: CrudLogsFilter = {
  actionDateTime: new Date(),
  actionType: 0,
};

export function CrudLogs() {
  const [error, setError] = useState<string | undefined>();
  const [crudLogsView, setCrudLogsView] = useState<CrudLogView[]>([]);

  const form = useZodForm({ schema, defaultValues });

  const loadCrudLogs = useCallback(async (filter: CrudLogsFilter) => {
    setError(undefined);

    const response = await getCrudLogs(filter);
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setCrudLogsView(response.data);
  }, []);

  useEffect(() => {
    void loadCrudLogs(form.getValues());
  }, [form, loadCrudLogs]);

  return (
    <div className="container mt-4">
      <div className="accordion mb-3" id="accordionExample">
        <div className="accordion-item">
          <div className="accordion-header" id="headingOne">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Филтър
            </button>
          </div>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            aria-labelledby="headingOne"
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <CustomForm form={form} onSubmit={loadCrudLogs}>
                <CustomSelect
                  {...form.register('actionType')}
                  options={crudLogSelectOptions}
                  isNumber
                  searchable={false}
                  label="Тип"
                />
                <CustomDateInput
                  {...form.register('actionDateTime')}
                  label="Дата"
                  showTime={false}
                />
                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-primary">
                    Търси
                  </button>
                </div>
              </CustomForm>
            </div>
          </div>
        </div>
      </div>

      {crudLogsView.length > 0 &&
        crudLogsView.map((x) => (
          <div
            key={x.crudLogId}
            className="accordion mb-2"
            id={`accordionExample${x.crudLogId}`}
          >
            <div className="accordion-item">
              <div className="accordion-header" id="headingOne">
                <button
                  className={`accordion-button text-white bg-${accordionBackColor.get(
                    x.actionType!
                  )}`}
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#collapse${x.crudLogId}`}
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  <div className="row w-100">
                    <div className="col-md-8 col-lg-9"> {x.tableAffected}</div>
                    <div className="col-md-4 col-lg-3">
                      {formatDateTime(x.actionDateTime!)}
                    </div>
                  </div>
                </button>
              </div>
              <div
                id={`collapse${x.crudLogId}`}
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent={`#accordionExample${x.crudLogId}`}
              >
                <div className="accordion-body">
                  <div>
                    Извършил действието:
                    <Link
                      className="ms-2"
                      to={`/users/${x.createdByUserId}/view`}
                    >
                      {x.username}
                    </Link>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-lg-6">
                      <pre>
                        {JSON.stringify(
                          JSON.parse(x.pocoBeforeAction),
                          null,
                          2
                        )}
                      </pre>
                    </div>
                    <div className="col-lg-5">
                      <pre>
                        {JSON.stringify(JSON.parse(x.pocoAfterAction), null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
