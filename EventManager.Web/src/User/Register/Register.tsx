import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { registerUser } from '~Infrastructure/api-requests';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomButtonFileInput } from '~Infrastructure/components/Form/CustomForm/CustomButtonFileInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { objectToFormData } from '~Infrastructure/utils';
import { RegionMultiSelect } from '~Shared/SmartSelects/Region/RegionMultiSelect';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';
import noUserLogo from '~asset/no-user-logo.png';

import './Register.css';

const schema = z.object({
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
  shortDescription: z.string().nullable(),
  profilePicture: z.instanceof(FileList).nullable(),
});

export type NewUser = z.infer<typeof schema>;

export function Register() {
  const navigate = useNavigate();

  const [error, setError] = useState<string>();
  const [profilePicture, setProfilePicture] = useState<string>(noUserLogo);

  const form = useZodForm({ schema });

  const handleRegister = useCallback(
    async (user: NewUser) => {
      if (user.password !== user.passwordRepeated) {
        form.setError('password', { message: 'Паролите не съвпадат' });
        form.setError('passwordRepeated', { message: 'Паролите не съвпадат' });
        return;
      }

      const formData = objectToFormData(user);
      const response = await registerUser(formData);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toast.success(
        'Успешна регистрация. Моля, потвърдете имейла си, за да влезете в системата.'
      );
      navigate('/users/login');
    },
    [form, navigate]
  );

  const onProfilePictureChosen = (file: File) => {
    setProfilePicture(URL.createObjectURL(file));
  };

  return (
    <div className="register-wrapper">
      <CustomForm form={form} onSubmit={handleRegister}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card">
              <h4 className="card-header">Профилна снимка</h4>
              <div className="card-body d-flex flex-column gap-2 justify-content-center align-items-center">
                <img className="profile-picture" src={profilePicture} alt="" />
                <CustomButtonFileInput
                  {...form.register('profilePicture')}
                  label="Избери профилна снимка"
                  onFileChosen={onProfilePictureChosen}
                />
              </div>
            </div>
          </div>
          <div className="col-md-8">
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
                        <CustomTextArea
                          {...form.register('shortDescription')}
                          label="Кратко описание"
                          rows={3}
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
                  <button type="submit" className="btn btn-primary">
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
          </div>
        </div>
      </CustomForm>
    </div>
  );
}
