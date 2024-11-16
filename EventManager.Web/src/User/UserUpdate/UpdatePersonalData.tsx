import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { updateUserPersonalData } from '~Infrastructure/ApiRequests/users-requests';
import { ImageCropModal } from '~Infrastructure/ImageCropping/ImageCropper';
import {
  type UserForUpdate,
  UserUpdatePersonalDataSchema,
  type UserUpdatePersonalDataType,
} from '~Infrastructure/api-types';
import { ErrorMessage } from '~Infrastructure/components/ErrorMessage/ErrorMessage';
import { CustomFileInputButton } from '~Infrastructure/components/Form/CustomForm/CustomButtonFileInput';
import { CustomForm } from '~Infrastructure/components/Form/CustomForm/CustomForm';
import { CustomInput } from '~Infrastructure/components/Form/CustomForm/CustomInput';
import { CustomTextArea } from '~Infrastructure/components/Form/CustomForm/CustomTextArea';
import { useZodForm } from '~Infrastructure/components/Form/CustomForm/UseZedForm';
import { convertToFileList, objectToFormData } from '~Infrastructure/utils';
import { RegionMultiSelect } from '~Shared/SmartSelects/Region/RegionMultiSelect';
import { RegionSelect } from '~Shared/SmartSelects/Region/RegionSelect';
import noUserLogo from '~asset/no-user-logo.png';

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
    setShowCropImageModal(true);
    URL.revokeObjectURL(selectedImage);
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
      toast.success('Успешно променени данни.');
    },
    [onUserUpdate, userId]
  );

  const closeImageCropModal = useCallback(() => {
    form.setValue('profilePicture', null);
    setShowCropImageModal(false);
  }, [form]);

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
          searchable={false}
        />
        <RegionMultiSelect
          {...form.register('userRegionsHelpingIds')}
          label="Искам да помагам в"
          isNumber
          required
          searchable={false}
        />

        <div className="d-flex justify-content-center mt-3">
          <button type="submit" className="btn btn-primary">
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
          onCancel={closeImageCropModal}
        />
      )}
    </div>
  );
}
