import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getAllOrganizationsView } from '~/Infrastructure/ApiRequests/organizations-requests';
import type { OrganizationView } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { TextInput } from '~/Infrastructure/components/Form/TextInput/TextInput';

import { OrganizationFormModal } from './OrganizationFormModal';

interface OrganizationsCatalogFilter {
  organizationName: string;
}

const defaultValues: OrganizationsCatalogFilter = {
  organizationName: '',
};

export function OrganizationsCatalog() {
  const [organizations, setOrganizations] = useState<OrganizationView[]>([]);

  const [error, setError] = useState<string | undefined>();
  const [filter, setFilter] =
    useState<OrganizationsCatalogFilter>(defaultValues);

  const [organizationIdForEdit, setOrganizationIdForEdit] = useState<
    number | undefined
  >();
  const [formModal, setFormModal] = useState<boolean>(false);

  const closeFormModal = useCallback(() => {
    setOrganizationIdForEdit(undefined);
    setFormModal(false);
  }, []);

  const showFormModal = useCallback((organizationId?: number) => {
    setOrganizationIdForEdit(organizationId);
    setFormModal(true);
  }, []);

  const handleOnCreated = useCallback(
    (organization: OrganizationView) => {
      setOrganizations([organization, ...organizations]);
      setFilter(defaultValues);
      closeFormModal();
    },
    [closeFormModal, organizations]
  );

  const handleOnUpdated = useCallback(
    (organization: OrganizationView) => {
      const newOrganizations = organizations.map((x) =>
        x.organizationId === organization.organizationId ? organization : x
      );

      setOrganizations(newOrganizations);
      closeFormModal();
    },
    [closeFormModal, organizations]
  );

  const handleFilterNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      setFilter({ organizationName: value });
    },
    []
  );

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
              .startsWith(filter.organizationName.toLowerCase())
          : true
      ),
    [organizations, filter.organizationName]
  );

  return (
    <div className="mw-900px m-50auto">
      <div className="container">
        <div className="card">
          <h4 className="card-header d-flex justify-content-between align-items-center">
            <div>Организации</div>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => showFormModal()}
            >
              Нова организация
            </button>
          </h4>
          <div className="card-body">
            <TextInput
              name="filterName"
              label="Търси"
              value={filter.organizationName}
              onChange={handleFilterNameChange}
            />

            <hr />

            {displayedOrganizations.length > 0 ? (
              displayedOrganizations.map((x) => (
                <div key={x.organizationId} className="card mb-2">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-4">
                        <img
                          src={x.organizationLogoUrl}
                          className="w-100"
                          alt=""
                        />
                      </div>
                      <div className="col-md-8 d-flex flex-column">
                        <h4>{x.organizationName}</h4>

                        <div className="d-flex justify-content-center mt-auto">
                          <button
                            type="button"
                            className="btn btn-primary ms-auto"
                            onClick={() => showFormModal(x.organizationId)}
                          >
                            Редакция
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Няма намерени Организации</p>
            )}
          </div>
        </div>
      </div>

      {error && <ErrorMessage error={error} />}

      {formModal && (
        <OrganizationFormModal
          organizationId={organizationIdForEdit}
          onCreated={handleOnCreated}
          onUpdated={handleOnUpdated}
          onCancel={closeFormModal}
        />
      )}
    </div>
  );
}
