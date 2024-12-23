import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { SelectInput } from '~/Infrastructure/components/Form/SelectInput/SelectInput';
import type { SelectInputOption } from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';
import { formatDateTime } from '~/Infrastructure/utils';
import { UserProfileOrganizationType } from '~/User/user-utils';

import type { UserOrganizationsOptions } from './UserProfile';

interface ProfileOrganizationsProps {
  userIsOrganizationManager: boolean;
  options: UserOrganizationsOptions;
  saveScrollPosition: () => void;
  onInputChange: (value: string) => void;
}

export function ProfileOrganizations(props: ProfileOrganizationsProps) {
  const { userIsOrganizationManager, options, onInputChange, saveScrollPosition } = props;
  const { organizations, error, type } = options;

  const [selectOptions, setSelectOptions] = useState<SelectInputOption[]>([
    { value: UserProfileOrganizationType.Subscriptions.toString(), label: 'Организации за които съм се записал' },
  ]);

  useEffect(() => {
    if (userIsOrganizationManager) {
      setSelectOptions((prevOptions) => {
        const optionExists = prevOptions.some(
          (option) => option.value === UserProfileOrganizationType.Managed.toString()
        );
        if (!optionExists) {
          return [
            ...prevOptions,
            { value: UserProfileOrganizationType.Managed.toString(), label: 'Организации които менажирам' },
          ];
        }
        return prevOptions;
      });
    }
  }, [userIsOrganizationManager]);

  const loadInitial = useCallback(() => {
    if (organizations.length === 0) {
      onInputChange(options.type);
    }
  }, [onInputChange, options.type, organizations.length]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  return (
    <div>
      <SelectInput
        name="eventType"
        label="Тип"
        options={selectOptions}
        onChange={onInputChange}
        loading={false}
        searchable={false}
        value={type}
      />
      {error && <ErrorMessage error={error} />}

      {organizations.length > 0 &&
        organizations.map((x) => (
          <div className="mb-2" key={x.organizationId}>
            <Link
              className="unset-anchor"
              to={CustomRoutes.organizationsView(x.organizationId)}
              onClick={saveScrollPosition}
            >
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-12 col-sm-4">
                      <div className="d-flex mh-200px">
                        <img className="object-fit-cover w-100" src={x.organizationLogoUrl} alt={x.organizationName} />
                      </div>
                    </div>
                    <div className="col-12 col-sm-8">
                      <div className="d-flex d-sm-block justify-content-center fs-5 fw-bold">{x.organizationName}</div>
                      <hr className="m-1" />
                      <div className="clip-7-rows">{x.organizationDescription}</div>
                    </div>
                  </div>
                </div>

                {type === UserProfileOrganizationType.Subscriptions.toString() && (
                  <div className="card-footer">
                    <div>Записан на: {formatDateTime(x.organizationSubscriptionCreatedOnDateTime)}</div>
                  </div>
                )}
              </div>
            </Link>
          </div>
        ))}
    </div>
  );
}
