import { faGear, faShield, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import type { z } from 'zod';

import {
  getUserPersonalData,
  getUserProfilePicture,
  updateUserPersonalData,
} from '~Infrastructure/api-requests';
import { userManipulationSchema } from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomButtonFileInput } from '~Infrastructure/components/Form/CustomForm/CustomButtonFileInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { fileToBase64, objectToFormData } from '~Infrastructure/utils';
import { RegionMultiSelect } from '~Shared/SmartSelects/Region/RegionMultiSelect';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';
import noUserLogo from '~asset/no-user-logo.png';

import './UserUpdate.css';

const userUpdatePersonalDataSchema = userManipulationSchema.extend({});

export type UserUpdatePersonalData = z.infer<
  typeof userUpdatePersonalDataSchema
>;

interface UpdateUserDataProps {
  userId: number;
  userProfilePicture: string | undefined;
  user: UserUpdatePersonalData;
}

function UserUpdateData(props: UpdateUserDataProps) {
  const [error, setError] = useState<string | undefined>();
  const [profilePicture, setProfilePicture] = useState<string>(noUserLogo);

  const { user, userId, userProfilePicture } = props;

  const form = useZodForm({ schema: userManipulationSchema });

  const onProfilePictureChange = async (file: File) => {
    const base64 = await fileToBase64(file);
    setProfilePicture(`data:image/png;base64, ${base64}`);
  };

  const handleSubmit = useCallback(
    async (personalData: UserUpdatePersonalData) => {
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

const UserEditTabNames = {
  profile: 'Профил',
  settings: 'Настройки',
  security: 'Сигурност',
} as const;

type UserEditTabName = keyof typeof UserEditTabNames;

export function UserUpdate() {
  const [activeTab, setActiveTab] = useState<UserEditTabName>('profile');
  const [error, setError] = useState<string | undefined>();
  const [user, setUser] = useState<UserUpdatePersonalData | undefined>();
  const [userProfilePicture, setUserProfilePicture] = useState<
    string | undefined
  >();

  const { userId } = useParams();

  const handleTabClick = useCallback((tab: UserEditTabName) => {
    setActiveTab(tab);
  }, []);

  const loadUser = useCallback(async () => {
    const userResponse = await getUserPersonalData(Number(userId));
    if (!userResponse.success) {
      setError(userResponse.errorMessage);
      return;
    }

    setUser(userResponse.data);

    const profilePictureResponse = await getUserProfilePicture(Number(userId));
    if (!profilePictureResponse.success) {
      setError(profilePictureResponse.errorMessage);
      return;
    }

    setUserProfilePicture(URL.createObjectURL(profilePictureResponse.data));
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  return (
    <div className="user-update-wrapper mt-3">
      <div className="container">
        <div className="row gutters-sm">
          <div className="col-md-4 d-none d-md-block">
            <div className="card">
              <div className="card-body p-2">
                <nav className="nav flex-column ps-2">
                  <div className="nav-buttons">
                    <button
                      type="button"
                      className={`nav-button ${
                        activeTab === 'profile' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('profile')}
                    >
                      <FontAwesomeIcon
                        className="fa-fw me-2 fa-border"
                        icon={faUser}
                        size="xl"
                      />
                      {UserEditTabNames.profile}
                    </button>

                    <button
                      type="button"
                      className={`nav-button ${
                        activeTab === 'settings' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('settings')}
                    >
                      <FontAwesomeIcon
                        className="fa-fw me-2 fa-border"
                        icon={faGear}
                        size="xl"
                      />
                      {UserEditTabNames.settings}
                    </button>

                    <button
                      type="button"
                      className={`nav-button ${
                        activeTab === 'security' ? 'active' : ''
                      }`}
                      onClick={() => handleTabClick('security')}
                    >
                      <FontAwesomeIcon
                        className="fa-fw me-2 fa-border"
                        icon={faShield}
                        size="xl"
                      />
                      {UserEditTabNames.security}
                    </button>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card">
              <div className="card-header  d-flex d-md-none">
                <ul className="nav nav-tabs card-header-tabs nav-gap-x-1">
                  <li className="nav-item">
                    <FontAwesomeIcon
                      className={`nav-link fs-2 ${
                        activeTab === 'profile' ? 'active' : ''
                      }`}
                      icon={faUser}
                      size="3x"
                      onClick={() => handleTabClick('profile')}
                    />
                  </li>
                  <li className="nav-item">
                    <FontAwesomeIcon
                      className={`nav-link fs-2 ${
                        activeTab === 'settings' ? 'active' : ''
                      }`}
                      icon={faGear}
                      size="3x"
                      onClick={() => handleTabClick('settings')}
                    />
                  </li>
                  <li className="nav-item">
                    <FontAwesomeIcon
                      className={`nav-link fs-2 ${
                        activeTab === 'security' ? 'active' : ''
                      }`}
                      icon={faShield}
                      size="3x"
                      onClick={() => handleTabClick('security')}
                    />
                  </li>
                </ul>
              </div>
              <div className="card-body tab-content">
                {user && activeTab === 'profile' && (
                  <UserUpdateData
                    user={user}
                    userId={Number(userId)}
                    userProfilePicture={userProfilePicture}
                  />
                )}
              </div>
            </div>
          </div>
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
