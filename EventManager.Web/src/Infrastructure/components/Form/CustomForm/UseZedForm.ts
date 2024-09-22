import { zodResolver } from '@hookform/resolvers/zod';
import { type UseFormProps, useForm } from 'react-hook-form';
import type { TypeOf, ZodObject, ZodRawShape, ZodSchema } from 'zod';

interface UseZodFormProps<Z extends ZodSchema>
  extends Exclude<UseFormProps<TypeOf<Z>>, 'resolver'> {
  schema: Z;
}

function getDefaultValuesFromSchema<T extends ZodObject<ZodRawShape>>(
  schema: T
) {
  const { shape } = schema; // Access shape safely since we know it's a ZodObject
  const defaultValues: Partial<Record<keyof T['shape'], null>> = {};

  // Use Object.keys to iterate over the schema shape
  for (const key of Object.keys(shape)) {
    const field = shape[key];

    if (field.isNullable()) {
      defaultValues[key as keyof T['shape']] = null; // Set nullable fields to null
    }
  }

  return defaultValues;
}

export const useZodForm = <Z extends ZodObject<ZodRawShape>>({
  schema,
  ...formProps
}: UseZodFormProps<Z>) => {
  const defaultValues = getDefaultValuesFromSchema(schema);

  return useForm({
    ...formProps,
    defaultValues: { ...defaultValues, ...formProps.defaultValues }, // Merge with user-provided defaults
    resolver: zodResolver(schema),
  });
};
