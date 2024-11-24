import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { getCrudLogs } from '~/Infrastructure/ApiRequests/crud-logs-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import {
  CrudLogFilterSchema,
  type CrudLogFilterType,
  type CrudLogView,
} from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomDateInput } from '~/Infrastructure/components/Form/CustomForm/CustomDateInput';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomSelect } from '~/Infrastructure/components/Form/CustomForm/CustomSelect';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import type { SelectInputOption } from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';
import { formatDateTime } from '~/Infrastructure/utils';

const accordionBackColor = new Map<number, string>([
  [1, 'success'],
  [2, 'primary'],
  [3, 'danger'],
]);

const crudLogSelectOptions: SelectInputOption[] = [
  { value: '0', label: 'Всички' },
  { value: '1', label: 'Създаване' },
  { value: '2', label: 'Редакция' },
  { value: '3', label: 'Изтриване' },
];

const defaultValues: CrudLogFilterType = {
  actionDateTime: new Date(),
  actionType: 0,
};

export function CrudLogs() {
  const [error, setError] = useState<string | undefined>();
  const [crudLogsView, setCrudLogsView] = useState<CrudLogView[]>([]);

  const form = useZodForm({ schema: CrudLogFilterSchema, defaultValues });

  const loadCrudLogs = useCallback(async (filter: CrudLogFilterType) => {
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
      <div className="mw-900px m-50auto">
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
                <div className="accordion-header">
                  <button
                    className={`accordion-button text-white bg-${accordionBackColor.get(
                      x.crudLogActionType
                    )}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${x.crudLogId}`}
                    aria-expanded="false"
                    aria-controls={`#collapse${x.crudLogId}`}
                  >
                    <div className="row w-100">
                      <div className="col-md-8 col-lg-9">{x.crudLogTable}</div>
                      <div className="col-md-4 col-lg-3">
                        {formatDateTime(x.crudLogCreatedOnDateTime)}
                      </div>
                    </div>
                  </button>
                </div>
                <div
                  id={`collapse${x.crudLogId}`}
                  className="accordion-collapse collapse"
                  data-bs-parent={`#accordionExample${x.crudLogId}`}
                >
                  <div className="accordion-body">
                    <div>
                      Извършил действието:
                      <Link
                        className="ms-2"
                        to={CustomRoutes.usersView(x.crudLogCreatedByUserId!)}
                      >
                        {x.username}
                      </Link>
                    </div>
                    <hr />
                    <div className="row">
                      <div className="col-lg-6">
                        <pre>
                          {JSON.stringify(
                            JSON.parse(x.crudLogPocoBeforeAction),
                            null,
                            2
                          )}
                        </pre>
                      </div>
                      <div className="col-lg-5">
                        {x.crudLogPocoAfterAction && (
                          <pre>
                            {JSON.stringify(
                              JSON.parse(x.crudLogPocoAfterAction),
                              null,
                              2
                            )}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {error && <ErrorMessage error={error} />}
      </div>
    </div>
  );
}
