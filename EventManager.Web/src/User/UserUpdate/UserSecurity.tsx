import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { updateUserPassword } from '~Infrastructure/ApiRequests/users-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

const schema = z.object({
  oldPassword: z.string().min(5, 'Полето трябва да е минимум 5 символа'),
  newPassword: z.string().min(5, 'Полето трябва да е минимум 5 символа'),
  newPasswordRepeated: z
    .string()
    .min(5, 'Полето трябва да е минимум 5 символа'),
});

export type UserUpdatePassword = z.infer<typeof schema>;

interface UserSecurityProps {
  userId: number;
}

const defaultValues: UserUpdatePassword = {
  oldPassword: '',
  newPassword: '',
  newPasswordRepeated: '',
};

export function UserSecurity(props: UserSecurityProps) {
  const [error, setError] = useState<string | undefined>();

  const { userId } = props;

  const form = useZodForm({ schema });

  const handleSubmit = useCallback(
    async (password: UserUpdatePassword) => {
      setError(undefined);

      const response = await updateUserPassword(userId, password);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toast.success('Успешно променихте паролата си.');
      form.reset(defaultValues);
    },
    [form, userId]
  );

  return (
    <div className="user-security-wrapper">
      <h6>Настройки за сигурност</h6>
      <hr />
      <h4 className="mb-3">Промяна на парола</h4>
      <CustomForm form={form} onSubmit={handleSubmit}>
        <CustomInput
          {...form.register('oldPassword')}
          label="Текуща парола"
          type="password"
          required
        />
        <CustomInput
          {...form.register('newPassword')}
          label="Нова парола"
          type="password"
          required
        />
        <CustomInput
          {...form.register('newPasswordRepeated')}
          label="Повторете нова парола"
          type="password"
          required
        />

        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary">
            Обнови
          </button>
        </div>
      </CustomForm>
      {error && <ErrorMessage error={error} />}
      <hr />
      <h4>Последно активни сесии</h4>
      <div className="text-muted">
        Това е лист от от устройства, от които сте влизали в акаунта си
      </div>
    </div>
  );
}