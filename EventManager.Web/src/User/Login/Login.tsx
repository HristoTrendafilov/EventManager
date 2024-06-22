import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { loginUserThunk } from '~Infrastructure/redux/session-slice';
import { useAppDispatch } from '~Infrastructure/redux/store';
import { getClientErrorMessage } from '~Infrastructure/utils';

import './Login.css';

const schema = z.object({
  username: z.string(),
  password: z.string(),
});

export type UserLoginDto = z.infer<typeof schema>;

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [error, setError] = useState<string>();

  const handleLogin = useCallback(
    async (data: UserLoginDto) => {
      try {
        await dispatch(loginUserThunk(data)).unwrap();
        navigate('/');
      } catch (err) {
        setError(getClientErrorMessage(err));
      }
    },
    [dispatch, navigate]
  );

  const form = useZodForm({ schema });

  return (
    <div className="login-wrapper">
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
              required
              type="password"
            />

            <div className="d-flex justify-content-center">
              <button type="submit" className="btn btn-primary login-btn">
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
    </div>
  );
}
