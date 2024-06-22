import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { SelectInstance } from 'react-select';

import { getRegions } from '~Infrastructure/api-requests';
import { CustomSelect } from '~Infrastructure/components/Form/CustomForm/CustomSelect';
import type {
  CustomSelectInputProps,
  SelectInputOption,
} from '~Infrastructure/components/Form/SelectInput/selectInputUtils';
import { getClientErrorMessage } from '~Infrastructure/utils';

export const RegionSelect = forwardRef<
  SelectInstance<SelectInputOption>,
  CustomSelectInputProps
>((props, ref) => {
  const [options, setOptions] = useState<SelectInputOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  const fetchRegions = useCallback(async () => {
    setLoading(true);

    try {
      const regions = await getRegions();
      const regionOptions: SelectInputOption[] = regions.map((region) => ({
        value: region.regionId.toString(),
        label: region.regionName,
      }));

      setOptions(regionOptions);
    } catch (err) {
      setError(getClientErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
