import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { SelectInstance } from 'react-select';

import { getUserOrganizationsSelect } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomSelect } from '~/Infrastructure/components/Form/CustomForm/CustomSelect';
import type {
  CustomSelectInputProps,
  SelectInputOption,
} from '~/Infrastructure/components/Form/SelectInput/selectInputUtils';

interface OrganizationSelectProps extends CustomSelectInputProps {
  userId: number;
}

export const OrganizationSelect = forwardRef<SelectInstance<SelectInputOption>, OrganizationSelectProps>(
  (props, ref) => {
    const [options, setOptions] = useState<SelectInputOption[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();

    const fetchOrganizations = useCallback(async () => {
      setLoading(true);

      const response = await getUserOrganizationsSelect(props.userId);
      if (!response.success) {
        setError(response.errorMessage);
        setLoading(false);
        return;
      }

      const organizations: SelectInputOption[] = response.data.map((x) => ({
        value: x.organizationId.toString(),
        label: x.organizationName,
      }));

      setOptions(organizations);
      setLoading(false);
    }, [props.userId]);

    useEffect(() => {
      void fetchOrganizations();
    }, [fetchOrganizations]);

    return <CustomSelect {...props} ref={ref} options={options} loading={loading} error={error} />;
  }
);
