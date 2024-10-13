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

export interface UserLoginResponseDto extends UserState {
  token: string;
}
