import type { ComponentProps } from 'react';
import {
  type FieldValues,
  FormProvider,
  type SubmitHandler,
  type UseFormReturn,
} from 'react-hook-form';

import { reportError } from '~/Infrastructure/utils';

interface Props<T extends FieldValues>
  extends Omit<ComponentProps<'form'>, 'onSubmit' | 'onError'> {
  form: UseFormReturn<T>;
  onSubmit: SubmitHandler<T>;
}

function onFormError(err: unknown) {
  reportError(err);
}

export const CustomForm = <T extends FieldValues>({
  form,
  onSubmit,
  children,
  ...props
}: Props<T>) => (
  <FormProvider {...form}>
    <form onSubmit={form.handleSubmit(onSubmit, onFormError)} {...props}>
      <fieldset disabled={form.formState.isSubmitting}>{children}</fieldset>
    </form>
  </FormProvider>
);
