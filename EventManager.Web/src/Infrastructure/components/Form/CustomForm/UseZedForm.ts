import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormProps, useForm } from 'react-hook-form';
import type { TypeOf, ZodSchema } from 'zod';

interface UseZodFormProps<Z extends ZodSchema>
  extends Exclude<UseFormProps<TypeOf<Z>>, 'resolver'> {
  schema: Z;
}

export const useZodForm = <Z extends ZodSchema>({
  schema,
  ...formProps
}: UseZodFormProps<Z>) =>
  useForm({
    ...formProps,
    resolver: zodResolver(schema),
  });
