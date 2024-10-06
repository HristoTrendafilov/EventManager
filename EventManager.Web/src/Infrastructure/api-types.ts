import type { UserState } from './redux/user-slice';

export interface LogoutUserDto {
  webSessionId: number;
}

export interface RegionDto {
  regionId: number;
  regionName: string;
}

export interface UserDto {
  userId: number;
  createdOnDateTime: Date;
  username: string;
  firstName: string;
  secondName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  regionId: number;
  regionsHelping: RegionDto[];
}

export interface ImageDto {
  imageId: number;
  imageName: string;
  imageExtension: string;
  imageFilePath: string;
  imageIsMain: boolean;
  eventId: number;
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

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface UserLoginResponseDto extends UserState {
  token: string;
}

export interface UserNewDto {
  username: string;
  password: string;
  passwordRepeated: string;
  firstName: string;
  secondName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  regionId: number;
  userRegionsHelpingIds: number[];
}
