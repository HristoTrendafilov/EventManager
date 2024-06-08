import { z } from 'zod';

import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomMultiSelect } from '~Infrastructure/components/Form/CustomForm/CustomMultiSelect';
import { CustomSelect } from '~Infrastructure/components/Form/CustomForm/CustomSelect';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

import './Event.css';

const schema = z.object({
  email: z.string().email(),
  count: z.coerce.number(),
  test: z.string().min(4, 'Please give 4'),
  select: z.string(), // Add this line
  multi: z.number().array().optional(),
});

export function Event() {
  const form = useZodForm({
    schema,
    defaultValues: {
      multi: [],
    },
  });

  /* eslint-disable no-console */
  console.log("I'm typesafe!", form.watch());
  /* eslint-enable no-console */

  return (
    <CustomForm
      form={form}
      onSubmit={(data) => {
        /* eslint-disable no-console */
        console.log("I'm typesafe!", data);
        /* eslint-enable no-console */
      }}
    >
      <CustomInput type="email" label="Email" {...form.register('email')} />
      <CustomInput
        value={213}
        type="number"
        label="Count"
        {...form.register('count')}
      />
      <CustomInput
        value="hihi"
        type="text"
        label="Text"
        {...form.register('test')}
      />
      <CustomSelect
        options={[{ value: '1', label: 'baba' }]}
        label="Select"
        {...form.register('select')}
      />
      <CustomMultiSelect
        {...form.register('multi')}
        label="Multi"
        options={[
          { value: '1', label: 'baba' },
          { value: '2', label: 'caca' },
        ]}
        isNumber
      />
      <button type="submit">Submit</button>
    </CustomForm>
  );
}
