import { useCallback, useState } from 'react';

import { updateUserPassword } from '~/Infrastructure/ApiRequests/users-requests';
import {
  UserUpdatePasswordSchema,
  type UserUpdatePasswordType,
  type WebSessionView,
} from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { toastService } from '~/Infrastructure/components/ToastService';
import { formatDateTime } from '~/Infrastructure/utils';

interface UserSecurityProps {
  userId: number;
  lastActiveWebSessions: WebSessionView[];
}

export function UserSecurity(props: UserSecurityProps) {
  const [error, setError] = useState<string | undefined>();

  const { userId, lastActiveWebSessions } = props;

  const form = useZodForm({ schema: UserUpdatePasswordSchema });

  const handleSubmit = useCallback(
    async (password: UserUpdatePasswordType) => {
      setError(undefined);

      const response = await updateUserPassword(userId, password);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toastService.success('Успешно променихте паролата си.');
      form.reset({
        currentPassword: '',
        newPassword: '',
        newPasswordRepeated: '',
      });
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
          {...form.register('currentPassword')}
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
          <button type="submit" className="btn btn-primary w-200px">
            Обнови
          </button>
        </div>
      </CustomForm>
      {error && <ErrorMessage error={error} />}
      <hr />
      <h4>Последно активни сесии</h4>
      <p className="text-muted">
        Това е лист от локации, от които сте влезли в последно време.
      </p>
      {lastActiveWebSessions.length > 0 &&
        lastActiveWebSessions.map((x) => (
          <div key={x.webSessionId} className="card mb-2">
            <div className="card-header d-flex justify-content-between">
              <div>
                {x.ipInfoCountry} ({x.ipInfoCountryCode})
              </div>
              <div>
                Координати: {x.ipInfoLat}, {x.ipInfoLon}
              </div>
            </div>
            <div className="card-body p-2">
              <div>
                град: {x.ipInfoCity} ({x.ipInfoPostCode})
              </div>
              <div>регион: {x.ipInfoRegionName}</div>
              <div className="d-flex justify-content-end">
                {formatDateTime(x.webSessionCreatedOnDateTime)}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
