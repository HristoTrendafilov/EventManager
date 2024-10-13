import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { SelectInstance } from 'react-select';

import { getRegions } from '~Infrastructure/api-requests';
import { CustomSelect } from '~Infrastructure/components/Form/CustomForm/CustomSelect';
import type {
  CustomSelectInputProps,
  SelectInputOption,
} from '~Infrastructure/components/Form/SelectInput/selectInputUtils';

export const RegionSelect = forwardRef<
  SelectInstance<SelectInputOption>,
  CustomSelectInputProps
>((props, ref) => {
  const [options, setOptions] = useState<SelectInputOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const fetchRegions = useCallback(async () => {
    setLoading(true);

    const response = await getRegions();
    if (!response.success) {
      setError(response.errorMessage);
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
    <CustomSelect
      {...props}
      ref={ref}
      options={options}
      loading={loading}
      error={error}
    />
  );
});
