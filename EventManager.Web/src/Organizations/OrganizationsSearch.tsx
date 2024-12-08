import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { getAllOrganizationsView } from '~/Infrastructure/ApiRequests/organizations-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import type { OrganizationView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { TextInput } from '~/Infrastructure/components/Form/TextInput/TextInput';

interface OrganizationsSearchFilter {
  organizationName: string;
}

const defaultValues: OrganizationsSearchFilter = {
  organizationName: '',
};

export function OrganizationsSearch() {
  const [organizations, setOrganizations] = useState<OrganizationView[]>([]);

  const [error, setError] = useState<string | undefined>();
  const [filter, setFilter] =
    useState<OrganizationsSearchFilter>(defaultValues);

  const loadOrganizations = useCallback(async () => {
    const response = await getAllOrganizationsView();
    if (!response.success) {
      setError(response.errorMessage);
      return;
    }

    setOrganizations(response.data);
  }, []);

  useEffect(() => {
    void loadOrganizations();
  }, [loadOrganizations]);

  const displayedOrganizations = useMemo(
    () =>
      organizations.filter((x) =>
        filter.organizationName
          ? x.organizationName
              .toLowerCase()
              .includes(filter.organizationName.toLowerCase())
          : true
      ),
    [organizations, filter.organizationName]
  );

  return (
    <div className="organization-search-wrapper mt-3">
      <div className="container">
        <div className="accordion" id="accordionExample">
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
              className="accordion-collapse collapse"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                <div className="row">
                  <div className="col-12">
                    <TextInput
                      name="organizationName"
                      label="Име на организацията"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setFilter({
                          ...filter,
                          organizationName: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {error && <ErrorMessage error={error} />}
        {displayedOrganizations.length > 0 ? (
          <div className="row mt-2 g-3">
            {displayedOrganizations.map((x) => (
              <div key={x.organizationId} className="col-md-4">
                <Link
                  className="unset-anchor"
                  key={x.organizationId}
                  to={CustomRoutes.organizationsView(x.organizationId)}
                >
                  <div className="card h-100">
                    <div className="card-header">
                      <div className="d-flex h-200px">
                        <img
                          src={x.organizationLogoUrl}
                          className="w-100 object-fit-cover"
                          alt=""
                        />
                      </div>
                    </div>
                    <div className="card-body p-1">
                      <h4 className="d-flex justify-content-center">
                        {x.organizationName}
                      </h4>
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
    </div>
  );
}
