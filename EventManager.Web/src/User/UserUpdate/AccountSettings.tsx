import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { updateUserUsername } from '~Infrastructure/ApiRequests/users-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';

const schema = z.object({
  username: z.string().min(5, 'Полето трябва да е минимум 5 символа'),
});

export type UpdateUserUsername = z.infer<typeof schema>;

interface UserAccountSettingsProps {
  userId: number;
  username: string;
}

export function UserAccountSettings(props: UserAccountSettingsProps) {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>();

  const { userId, username } = props;

  const form = useZodForm({ schema });

  const toggleIsLocked = useCallback(() => {
    setIsLocked(!isLocked);
  }, [isLocked]);

  const handleSubmit = useCallback(
    async (user: UpdateUserUsername) => {
      setError(undefined);

      const response = await updateUserUsername(userId, user.username);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toast.success('Успешно променихте потребителското си име.');
      toggleIsLocked();
    },
    [toggleIsLocked, userId]
  );

  useEffect(() => {
    form.reset({ username });
  }, [form, username]);

  return (
    <div className="user-account-settings-wrapper">
      <h6>Настройки на акаунта</h6>
      <hr />
      <CustomForm form={form} onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-8">
            <CustomInput
              {...form.register('username')}
              label="Потребителско име"
              required
              readOnly={isLocked}
            />
          </div>
          <div className="col-md-4">
            {isLocked && (
              <button
                type="button"
                className="btn btn-warning w-100"
                onClick={toggleIsLocked}
              >
                Отключи
              </button>
            )}
            {!isLocked && (
              <button type="submit" className="btn btn-primary w-100">
                Обнови
              </button>
            )}
          </div>
        </div>
        {error && <ErrorMessage error={error} />}
      </CustomForm>
      <hr />
      <div className="text-danger fs-4">Изтриване на акаунта</div>
      <p className="text-muted">
        Веднъж изтрит акаунта, няма връщане назад. Сигурни ли сте, че искате
        това?
      </p>
      <button type="button" className="btn btn-danger">
        Изтриване на акаунта
      </button>
    </div>
  );
}
