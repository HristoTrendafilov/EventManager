import type { CustomMultiSelectProps } from '~/Infrastructure/components/Form/CustomForm/CustomMultiSelect';
import type { CustomSelectProps } from '~/Infrastructure/components/Form/CustomForm/CustomSelect';

import type { MultiSelectInputProps } from './MultiSelectInput';
import type { SelectInputProps } from './SelectInput';

type SmartSelect<T> = Omit<T, 'options' | 'loading'>;
export type SelectInputSingle = SmartSelect<SelectInputProps>;
export type SelectInputMulti = SmartSelect<MultiSelectInputProps>;

export type CustomSelectInputProps = SmartSelect<CustomSelectProps>;
export type CustomMultiSelectInputProps = SmartSelect<CustomMultiSelectProps>;

export interface SelectInputOption {
  value: string;
  label: string;
}
