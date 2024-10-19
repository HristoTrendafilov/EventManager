import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { SelectInstance } from 'react-select';

import { getRegions } from '~Infrastructure/api-requests';
import { CustomMultiSelect } from '~Infrastructure/components/Form/CustomForm/CustomMultiSelect';
import type {
  CustomMultiSelectInputProps,
  SelectInputOption,
} from '~Infrastructure/components/Form/SelectInput/selectInputUtils';

export const RegionMultiSelect = forwardRef<
  SelectInstance<SelectInputOption>,
  CustomMultiSelectInputProps
>((props, ref) => {
  const [options, setOptions] = useState<SelectInputOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const fetchRegions = useCallback(async () => {
    setLoading(true);

    const response = await getRegions();
    if (!response.success) {
      setError(response.errorMessage);
      setLoading(false);
      return;
    }

    const regionOptions: SelectInputOption[] = response.data.map((region) => ({
      value: region.regionId.toString(),
      label: region.regionName,
    }));

    setOptions(regionOptions);
    setLoading(false);
  }, []);

  useEffect(() => {
    void fetchRegions();
  }, [fetchRegions]);

  return (
    <CustomMultiSelect
      {...props}
      ref={ref}
      options={options}
      loading={loading}
      error={error}
    />
  );
});
