import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { loginUser } from '~Infrastructure/ApiRequests/users-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { useAppDispatch } from '~Infrastructure/redux/store';
import { setUser } from '~Infrastructure/redux/user-slice';

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UserLogin = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string | undefined>();

  const form = useZodForm({ schema });

  const handleLogin = useCallback(
    async (data: UserLogin) => {
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
    <div className="mw-600px m-50auto">
      <div className="container">
        <div className="card border-1 border-danger">
          <h2 className="card-header text-white bg-danger bg-gradient">
            Потребителски вход
          </h2>
          <div className="card-body">
            <CustomForm form={form} onSubmit={handleLogin}>
              <CustomInput
                {...form.register('username')}
                label="Потребителско име"
                required
              />
              <CustomInput
                {...form.register('password')}
                label="Парола"
                type="password"
                required
              />

              <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-200px">
                  Вход
                </button>
              </div>
            </CustomForm>
          </div>

          {error && (
            <div className="card-footer">
              <ErrorMessage error={error} />
            </div>
          )}
        </div>
        <div className="mt-1">
          <span className="me-2">Все още нямате регистрация?</span>
          <Link to="/users/register">Регистрирай ме!</Link>
        </div>
      </div>
    </div>
  );
}
