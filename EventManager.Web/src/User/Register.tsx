import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { registerUser } from '~/Infrastructure/ApiRequests/users-requests';
import { ImageCropModal } from '~/Infrastructure/ImageCropping/ImageCropper';
import { CustomRoutes } from '~/Infrastructure/Routes/CustomRoutes';
import { UserNewSchema, type UserNewType } from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomFileInputButton } from '~/Infrastructure/components/Form/CustomForm/CustomFileInputButton';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~/Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { FileInputTypeEnum } from '~/Infrastructure/components/Form/formUtils';
import { toastService } from '~/Infrastructure/components/ToastService';
import { convertToFileList, objectToFormData } from '~/Infrastructure/utils';
import { RegionMultiSelect } from '~/Shared/SmartSelects/Region/RegionMultiSelect';
import { RegionSelect } from '~/Shared/SmartSelects/Region/RegionSelect';
import noUserLogo from '~/asset/no-user-logo.png';

export function Register() {
  const [error, setError] = useState<string>();
  const [selectedImage, setSelectedImage] = useState<string>(noUserLogo);
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropImageModal, setShowCropImageModal] = useState<boolean>(false);

  const navigate = useNavigate();

  const { form } = useZodForm({ schema: UserNewSchema });

  const handleRegister = useCallback(
    async (user: UserNewType) => {
      if (user.userPassword !== user.passwordRepeated) {
        form.setError('userPassword', { message: 'Паролите не съвпадат' });
        form.setError('passwordRepeated', { message: 'Паролите не съвпадат' });
        return;
      }

      const formData = objectToFormData(user);
      const response = await registerUser(formData);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      toastService.success('Успешна регистрация. Моля, потвърдете имейла си, за да влезете в системата.', {
        autoClose: 15000,
      });
      navigate(CustomRoutes.usersLogin());
    },
    [form, navigate]
  );

  const onProfilePictureChosen = useCallback(
    (file: File) => {
      URL.revokeObjectURL(selectedImage);
      setShowCropImageModal(true);
      setSelectedImage(URL.createObjectURL(file));
      setSelectedImageName(file.name);
    },
    [selectedImage]
  );

  const closeImageCropModal = useCallback(() => {
    setShowCropImageModal(false);
  }, []);

  const handleCropCancel = useCallback(() => {
    form.setValue('profilePicture', null);
    closeImageCropModal();
  }, [closeImageCropModal, form]);

  const onCropComplete = (imageBlob: File | null) => {
    if (croppedImage) {
      URL.revokeObjectURL(croppedImage);
    }

    if (imageBlob) {
      const croppedProfilePicture = URL.createObjectURL(imageBlob);
      setCroppedImage(croppedProfilePicture);

      const fileList = convertToFileList([imageBlob]);
      form.setValue('profilePicture', fileList);
    }

    closeImageCropModal();
  };

  useEffect(
    () => () => {
      URL.revokeObjectURL(selectedImage);
      if (croppedImage) {
        URL.revokeObjectURL(croppedImage);
      }
    },
    [croppedImage, selectedImage]
  );
  /* eslint-disable no-console */
  console.log(form.watch());
  /* eslint-enable no-console */

  return (
    <div className="container my-3">
      <CustomForm form={form} onSubmit={handleRegister}>
        <div className="row g-3">
          <div className="col-md-4">
            <div className="card _primary-border shadow">
              <h4 className="card-header _primary-bg-gradient-color  text-white">Профилна снимка</h4>
              <div className="card-body d-flex flex-column gap-2 justify-content-center align-items-center">
                <img
                  className="rounded-circle"
                  height={180}
                  width={180}
                  src={croppedImage || noUserLogo}
                  alt="profile"
                />
                <CustomFileInputButton
                  {...form.register('profilePicture')}
                  label="Избери профилна снимка"
                  onFileChosen={onProfilePictureChosen}
                  fileType={FileInputTypeEnum.Images}
                />
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="row g-2">
              <div className="col-md-6 h-100">
                <div className="card _primary-border shadow">
                  <h4 className="card-header _primary-bg-gradient-color  text-white">Потребителски данни</h4>
                  <div className="card-body">
                    <CustomInput {...form.register('username')} label="Потребителско име" addAsterisk />
                    <CustomInput {...form.register('userPassword')} label="Парола" type="password" addAsterisk />
                    <CustomInput
                      {...form.register('passwordRepeated')}
                      label="Повторете паролата"
                      type="password"
                      addAsterisk
                    />
                    <CustomTextArea {...form.register('userShortDescription')} label="Кратко описание" rows={3} />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card _primary-border shadow">
                  <h4 className="card-header _primary-bg-gradient-color  text-white">Лични данни</h4>
                  <div className="card-body">
                    <CustomInput {...form.register('userFirstName')} label="Име" addAsterisk />
                    <CustomInput {...form.register('userSecondName')} label="Презиме" />
                    <CustomInput {...form.register('userLastName')} label="Фамилия" addAsterisk />
                    <CustomInput {...form.register('userEmail')} label="Имейл" type="email" addAsterisk />
                    <CustomInput {...form.register('userPhoneNumber')} label="Телефон" type="number" />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card _primary-border shadow">
                  <h4 className="card-header _primary-bg-gradient-color  text-white">Локации</h4>
                  <div className="card-body">
                    <RegionSelect
                      {...form.register('regionId')}
                      label="Живея в"
                      isNumber
                      searchable={false}
                      addAsterisk
                    />
                    <RegionMultiSelect
                      {...form.register('userRegionsHelpingIds')}
                      label="Искам да помагам в"
                      isNumber
                      addAsterisk
                      searchable={false}
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button type="submit" className="btn btn-primary w-100">
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
      </CustomForm>

      {showCropImageModal && (
        <ImageCropModal
          imageSrc={selectedImage}
          fileName={selectedImageName}
          onCropComplete={onCropComplete}
          onCancel={handleCropCancel}
        />
      )}
    </div>
  );
}
