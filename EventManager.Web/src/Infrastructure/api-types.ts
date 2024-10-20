import type { UserState } from './redux/user-slice';

export interface RegionView {
  regionId: number;
  regionName: string;
}

export interface UserView {
  userId: number;
  createdOnDateTime: Date;
  username: string;
  firstName: string;
  secondName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  regionId: number;
  regionName: string;
  profilePictureBase64: string;
  shortDescription: string;
  canEdit: boolean;
  regionsHelping: RegionView[];
}

export interface EventDto {
  eventId: number;
  eventName: string;
  eventDescription: string | null;
  eventStartDateTime: Date;
  eventEndDateTime: Date | null;
  createdByUserId: number;
  regionId: number;
  image: FileList | undefined | null;
}

export interface UserLoginResponseDto extends UserState {
  token: string;
}

export interface FileObject {
  fileContents: string;
  contentType: string;
  fileDownloadName: string;
  lastModified: Date;
  entityTag: string;
  enableRangeProcessing: boolean;
}
