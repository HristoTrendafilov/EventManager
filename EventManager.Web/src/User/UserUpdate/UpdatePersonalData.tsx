import { useCallback, useEffect, useState } from 'react';

import { updateUserPersonalData } from '~/Infrastructure/ApiRequests/users-requests';
import { ImageCropModal } from '~/Infrastructure/ImageCropping/ImageCropper';
import {
  type UserForUpdate,
  UserUpdatePersonalDataSchema,
  type UserUpdatePersonalDataType,
} from '~/Infrastructure/api-types';
import { ErrorMessage } from '~/Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomFileInputButton } from '~/Infrastructure/components/Form/CustomForm/CustomButtonFileInput';
import { CustomForm } from '~/Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~/Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~/Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~/Infrastructure/components/Form/CustomForm/UseZedForm';
import { toastService } from '~/Infrastructure/components/ToastService';
import { convertToFileList, objectToFormData } from '~/Infrastructure/utils';
import { RegionMultiSelect } from '~/Shared/SmartSelects/Region/RegionMultiSelect';
import { RegionSelect } from '~/Shared/SmartSelects/Region/RegionSelect';
import noUserLogo from '~/asset/no-user-logo.png';

interface UpdatePersonalDataProps {
  userId: number;
  userProfilePicture: string | undefined;
  user: UserForUpdate;
  onUserUpdate: () => void;
}

export function UpdatePersonalData(props: UpdatePersonalDataProps) {
  const [error, setError] = useState<string | undefined>();
  const [selectedImage, setSelectedImage] = useState<string>(noUserLogo);
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropImageModal, setShowCropImageModal] = useState<boolean>(false);

  const { user, userId, userProfilePicture, onUserUpdate } = props;

  const form = useZodForm({
    schema: UserUpdatePersonalDataSchema,
    defaultValues: user,
  });

  const onProfilePictureChange = (file: File) => {
    URL.revokeObjectURL(selectedImage);
    setShowCropImageModal(true);
    setSelectedImage(URL.createObjectURL(file));
    setSelectedImageName(file.name);
  };

  const handleSubmit = useCallback(
    async (personalData: UserUpdatePersonalDataType) => {
      setError(undefined);

      const formData = objectToFormData(personalData);

      const response = await updateUserPersonalData(userId, formData);
      if (!response.success) {
        setError(response.errorMessage);
        return;
      }

      onUserUpdate();
      toastService.success('Успешно променени данни.');
    },
    [onUserUpdate, userId]
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

  useEffect(() => {
    if (userProfilePicture) {
      setCroppedImage(userProfilePicture);
    }
  }, [form, userProfilePicture]);

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
              src={croppedImage || noUserLogo}
            />
          </div>
          <CustomFileInputButton
            {...form.register('profilePicture')}
            label="Избери нова профилна снимка"
            className="d-flex justify-content-center mb-3 mt-2"
            onFileChosen={onProfilePictureChange}
          />
          <hr />
          <div className="col-lg-6">
            <CustomTextArea
              {...form.register('userShortDescription')}
              label="Кратко описание"
              rows={3}
            />
            <CustomInput
              {...form.register('userPhoneNumber')}
              label="Телефон"
            />
          </div>
          <div className="col-lg-6">
            <CustomInput
              {...form.register('userFirstName')}
              label="Име"
              required
            />
            <CustomInput {...form.register('userSecondName')} label="Презиме" />
            <CustomInput
              {...form.register('userLastName')}
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
          searchable={false}
        />
        <RegionMultiSelect
          {...form.register('userRegionsHelpingIds')}
          label="Искам да помагам в"
          isNumber
          required
          searchable={false}
        />

        <hr />

        <div className="d-flex justify-content-center">
          <button type="submit" className="btn btn-primary w-200px">
            Обнови
          </button>
        </div>
      </CustomForm>
      {error && <ErrorMessage error={error} />}

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
