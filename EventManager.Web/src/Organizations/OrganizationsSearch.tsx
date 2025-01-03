import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { getAllOrganizationsView } from '~/Infrastructure/ApiRequests/organizations-requests';
import { useScrollPosition } from '~/Infrastructure/CustomHooks/useScrollPosition';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { OrganizationView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { getUrlSearchParam, setUrlSearchParams } from '~/Infrastructure/utils';

const OrganizationSearchSchema = z.object({
  organizationName: z.string().nullable(),
});
export type OrganizationSearchType = z.infer<typeof OrganizationSearchSchema>;

export function OrganizationsSearch() {
  const [organizations, setOrganizations] = useState<OrganizationView[]>([]);
  const [filteredOrganizations, setFilteredOrganizations] = useState<OrganizationView[]>([]);
  const [error, setError] = useState<string | undefined>();

  const { form } = useZodForm({
    schema: OrganizationSearchSchema,
    defaultValues: { organizationName: getUrlSearchParam('organizationName') },
  });

  const { saveScrollPosition, restoreScrollPosition } = useScrollPosition();

  const handleSearch = useCallback(
    (filter: OrganizationSearchType) => {
      setUrlSearchParams({ organizationName: filter.organizationName });

      const filtered = organizations.filter((org) =>
        filter.organizationName
          ? org.organizationName.toLowerCase().includes(filter.organizationName.toLowerCase())
          : true
      );
      setFilteredOrganizations(filtered);
    },
    [organizations]
  );

  const loadOrganizations = useCallback(async () => {
    const response = await getAllOrganizationsView();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setOrganizations(response.data);
    setFilteredOrganizations(response.data);

    restoreScrollPosition();
  }, [restoreScrollPosition]);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  useEffect(() => {
    handleSearch(form.getValues());
  }, [form, handleSearch]);

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-body">
          <CustomForm form={form} onSubmit={handleSearch}>
            <div className="row">
              <div className="col-sm-9">
                <CustomInput {...form.register('organizationName')} label="Име на организацията" />
              </div>
              <div className="col-sm-3">
                <button type="submit" className="btn btn-primary w-100">
                  Търси
                </button>
              </div>
            </div>
          </CustomForm>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}
      {filteredOrganizations.length > 0 ? (
        <div className="row mt-2 g-3">
          {filteredOrganizations.map((x) => (
            <div key={x.organizationId} className="col-md-4">
              <Link
                className="unset-anchor"
                key={x.organizationId}
                to={CustomRoutes.organizationsView(x.organizationId)}
                onClick={saveScrollPosition}
              >
                <div className="card shadow _primary-border">
                  <div className="card-header">
                    <div className="d-flex h-200px">
                      <img src={x.organizationLogoUrl} className="w-100 object-fit-cover" alt="" />
                    </div>
                  </div>
                  <div className="card-body p-1">
                    <h4 className="d-flex justify-content-center">{x.organizationName}</h4>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p>Няма намерени Организации</p>
      )}
    </div>
  );
}
