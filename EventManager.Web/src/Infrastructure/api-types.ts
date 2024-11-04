import { z } from 'zod';

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
  userFullName: string;
  phoneNumber: string;
  email: string;
  regionId: number;
  regionName: string;
  shortDescription: string;
  canEdit: boolean;
  regionsHelping: RegionView[];
  hasProfilePicture: boolean;
}

export interface UserEventView {
  userEventId: number;
  userId: number;
  username: string;
  eventId: number;
  userSubscribedOnDateTime: Date;
  hasProfilePicture: boolean;
}

export interface EventView {
  eventId: number;
  eventName: string;
  eventDescription: string | null;
  eventStartDateTime: Date;
  eventEndDateTime: Date | null;
  regionId: number;
  createdByUserId: number;
  regionName: string;
  createdByUsername: string;
  isUserSubscribed: boolean;
  hasMainImage: boolean;
  canEdit: boolean;
}

export interface CrudLogView {
  crudLogId: number;
  actionType: number;
  tableAffected: string;
  tableAffectedPrimaryKey: number;
  pocoBeforeAction: string;
  pocoAfterAction: string;
  createdByUserId: number | null;
  actionDateTime: Date;
  username: string;
}

export interface HomeView {
  incommingEvents: EventView[];
}

export interface PaginationHeader {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
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

export interface PrimaryKeyResponse {
  primaryKey: number;
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

export interface SaveEventResponse {
  eventId: number;
}

export const userManipulationSchema = z.object({
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  regionId: z.number(),
  shortDescription: z.string().nullable(),
  userRegionsHelpingIds: z.number().array(),
  profilePicture: z.instanceof(FileList).nullable(),
});
