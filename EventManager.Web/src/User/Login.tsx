import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import { loginUser } from '~/Infrastructure/ApiRequests/users-requests';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import { UserLoginSchema, type UserLoginType } from '~/Infrastructure/api-types';
import { SubmitButton } from '~/Infrastructure/components/Buttons/SubmitButton';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { useAppDispatch } from '~/Infrastructure/redux/store';
import { setUser } from '~/Infrastructure/redux/user-slice';

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | undefined>();

  const { form, isSubmitting } = useZodForm({ schema: UserLoginSchema });

  const handleLogin = useCallback(
    async (data: UserLoginType) => {
      setError(undefined);

      const response = await loginUser(data);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      dispatch(setUser(response.data));
      navigate('/');
    },
    [dispatch, navigate]
  );

  return (
    <div className="container my-4 mw-700px">
      <div className="card _primary-border shadow">
        <h2 className="card-header _primary-bg-gradient-color text-white">Потребителски вход</h2>
        <div className="card-body">
          <CustomForm form={form} onSubmit={handleLogin}>
            <CustomInput {...form.register('username')} label="Потребителско име" addAsterisk />
            <CustomInput
              {...form.register('password')}
              label="Парола"
              type="password"
              addAsterisk
              autoComplete="password"
            />

            <SubmitButton text="Вход" className="d-flex justify-content-center" isSubmitting={isSubmitting} />
          </CustomForm>
          {error && <ErrorMessage error={error} />}
        </div>
      </div>
      <div className="mt-1">
        <span className="me-2">Все още нямате регистрация?</span>
        <Link to={CustomRoutes.usersRegister()}>Регистрирай ме!</Link>
      </div>
    </div>
  );
}
