import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { z } from 'zod';

import { updateUserPersonalData } from '~Infrastructure/ApiRequests/users-requests';
import { userManipulationSchema } from '~Infrastructure/api-types';
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

const userUpdatePersonalDataSchema = userManipulationSchema.extend({});

export type UpdatePersonalDataForm = z.infer<
  typeof userUpdatePersonalDataSchema
>;

interface UpdatePersonalDataProps {
  userId: number;
  userProfilePicture: string | undefined;
  user: UpdatePersonalDataForm;
}

export function UpdatePersonalData(props: UpdatePersonalDataProps) {
  const [error, setError] = useState<string | undefined>();
  const [profilePicture, setProfilePicture] = useState<string>(noUserLogo);

  const { user, userId, userProfilePicture } = props;

  const form = useZodForm({ schema: userManipulationSchema });

  const onProfilePictureChange = (file: File) => {
    setProfilePicture(URL.createObjectURL(file));
  };

  const handleSubmit = useCallback(
    async (personalData: UpdatePersonalDataForm) => {
      setError(undefined);

      const formData = objectToFormData(personalData);

      const response = await updateUserPersonalData(userId, formData);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toast.success('Успешно променени данни.');
    },
    [userId]
  );

  useEffect(() => {
    if (userProfilePicture) {
      setProfilePicture(userProfilePicture);
    }

    form.reset(user);
  }, [form, user, userProfilePicture]);

  return (
    <div className="user-data-wrapper">
      <h6>Профилна информация</h6>
      <hr />
      <CustomForm form={form} onSubmit={handleSubmit}>
        <div className="row">
          <div className="profile-picture-wrapper">
            <img
              alt="profile"
              className="profile-picture"
              src={profilePicture}
            />
          </div>
          <CustomButtonFileInput
            {...form.register('profilePicture')}
            label="Избери нова профилна снимка"
            className="d-flex justify-content-center mb-3 mt-2"
            onFileChosen={onProfilePictureChange}
          />
          <hr />
          <div className="col-lg-6">
            <CustomTextArea
              {...form.register('shortDescription')}
              label="Кратко описание"
              rows={3}
            />
            <CustomInput {...form.register('phoneNumber')} label="Телефон" />
          </div>
          <div className="col-lg-6">
            <CustomInput {...form.register('firstName')} label="Име" required />
            <CustomInput {...form.register('secondName')} label="Презиме" />
            <CustomInput
              {...form.register('lastName')}
              label="Фамилия"
              required
            />
          </div>
        </div>

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

        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary">
            Обнови
          </button>
        </div>
      </CustomForm>
      {error && <ErrorMessage error={error} />}
    </div>
  );
}
