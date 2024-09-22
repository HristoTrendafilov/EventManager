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
  eventDescription?: string;
  eventStartDateTime: Date;
  eventEndDateTime?: Date;
  createdByUserId: number;
  regionId: number;
  image?: ImageDto;
}

export interface UserLoginDto {
  username: string;
  password: string | null;
}
