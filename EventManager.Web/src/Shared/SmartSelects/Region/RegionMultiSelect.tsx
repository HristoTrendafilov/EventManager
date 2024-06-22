import { forwardRef, useCallback, useEffect, useState } from 'react';
import type { SelectInstance } from 'react-select';

import { getRegions } from '~Infrastructure/api-requests';
import { CustomMultiSelect } from '~Infrastructure/components/Form/CustomForm/CustomMultiSelect';
import type {
  CustomMultiSelectInputProps,
  SelectInputOption,
} from '~Infrastructure/components/Form/SelectInput/selectInputUtils';
import { getClientErrorMessage } from '~Infrastructure/utils';

export const RegionMultiSelect = forwardRef<
  SelectInstance<SelectInputOption>,
  CustomMultiSelectInputProps
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
    <CustomMultiSelect
      {...props}
      ref={ref}
      options={options}
      loading={loading}
      error={error}
    />
  );
});
