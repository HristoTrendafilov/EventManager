import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { registerUser } from '~Infrastructure/api-requests';
import type { UserNewDto } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { getClientErrorMessage } from '~Infrastructure/utils';
import { RegionMultiSelect } from '~Shared/SmartSelects/Region/RegionMultiSelect';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';

import './Register.css';

export function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState<string>();

  const handleRegister = useCallback(
    async (data: UserNewDto) => {
      try {
        await registerUser(data);
        navigate('/login');
      } catch (err) {
        setError(getClientErrorMessage(err));
      }
    },
    [navigate]
  );

  const form = useZodForm({
    schema: z.object({
      username: z.string().min(5, 'Полето трябва да е минимум 5 символа'),
      password: z.string().min(5, 'Полето трябва да е минимум 5 символа'),
      passwordRepeated: z.string(),
      firstName: z.string(),
      secondName: z.string().nullable(),
      lastName: z.string(),
      email: z.string().email('Неправилен имейл'),
      phoneNumber: z.string().nullable(),
      regionId: z.number(),
      userRegionsHelpingIds: z.number().array(),
    }) satisfies z.ZodType<UserNewDto>,
  });

  return (
    <div className="register-wrapper">
      <CustomForm form={form} onSubmit={handleRegister}>
        <div className="card">
          <h2 className="card-header text-white bg-danger bg-gradient">
            Регистрация
          </h2>
          <div className="card-body">
            <div className="row g-2">
              <div className="col-md-6 h-100">
                <div className="card">
                  <h4 className="card-header">Потребителски данни</h4>
                  <div className="card-body">
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
                    <CustomInput
                      {...form.register('passwordRepeated')}
                      label="Повторете паролата"
                      type="password"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <h4 className="card-header">Лични данни</h4>
                  <div className="card-body">
                    <CustomInput
                      {...form.register('firstName')}
                      label="Име"
                      required
                    />
                    <CustomInput
                      {...form.register('secondName')}
                      label="Презиме"
                    />
                    <CustomInput
                      {...form.register('lastName')}
                      label="Фамилия"
                      required
                    />
                    <CustomInput
                      {...form.register('email')}
                      label="Имейл"
                      type="email"
                      required
                    />
                    <CustomInput
                      {...form.register('phoneNumber')}
                      label="Телефон"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card">
                  <h4 className="card-header">Локации</h4>
                  <div className="card-body">
                    <RegionSelect
                      {...form.register('regionId')}
                      label="Живея в"
                      isNumber
                      required
                    />
                    <RegionMultiSelect
                      {...form.register('userRegionsHelpingIds')}
                      label="Искам да помагам в"
                      isNumber
                      required
                    />
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-info">
                Регистрация
              </button>
            </div>
          </div>

          {error && (
            <div className="card-footer">
              <ErrorMessage error={error} />
            </div>
          )}
        </div>
      </CustomForm>
    </div>
  );
}
