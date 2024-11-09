// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-use-before-define */

import { z } from 'zod';

// interfaces
export interface PaginationMetadata {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}

export interface PrimaryKeyResponse {
  primaryKey: number;
}

export interface UserForUpdate {
  hasProfilePicture: boolean;
  username: string;
  firstName: string;
  secondName: string;
  lastName: string;
  phoneNumber: string;
  shortDescription: string;
  regionId: number;
  userRegionsHelpingIds: number[];
  profilePicture: File | null | undefined;
  profilePicturePath: string;
}

export interface UserForWeb {
  userId: number;
  username: string;
  token: string;
  webSessionId: number;
  isLoggedIn: boolean;
  isAdmin: boolean;
  isEventCreator: boolean;
}

export interface UserView {
  canEdit: boolean;
  regionsHelping: RegionView[];
  userRegionsHelpingIds: number[];
  userId: number | null;
  username: string;
  firstName: string;
  secondName: string;
  lastName: string;
  userFullName: string;
  email: string;
  phoneNumber: string;
  regionId: number | null;
  createdOnDateTime: Date | null;
  createdByUserId: number | null;
  shortDescription: string;
  regionName: string;
  hasProfilePicture: boolean | null;
}

export interface RegionView {
  regionId: number;
  regionName: string;
}

export interface HomeView {
  incommingEvents: EventView[];
}

export interface EventForUpdate {
  hasMainImage: boolean;
  eventName: string;
  eventDescription: string;
  eventStartDateTime: Date;
  eventEndDateTime: Date | null;
  regionId: number;
  mainImage: File | null | undefined;
}

export interface EventView {
  canEdit: boolean;
  isUserSubscribed: boolean;
  subscribers: UserEventView[];
  eventId: number | null;
  eventName: string;
  eventDescription: string;
  eventStartDateTime: Date | null;
  eventEndDateTime: Date | null;
  regionId: number | null;
  createdByUserId: number | null;
  regionName: string;
  createdByUsername: string;
  eventCreatedAtDateTime: Date | null;
  hasMainImage: boolean | null;
}

export interface UserEventView {
  userEventId: number | null;
  userId: number | null;
  userSubscribedOnDateTime: Date | null;
  eventId: number | null;
  username: string;
  hasProfilePicture: boolean | null;
}

export interface CrudLogView {
  crudLogId: number | null;
  actionType: number | null;
  tableAffected: string;
  tableAffectedPrimaryKey: number | null;
  pocoBeforeAction: string;
  pocoAfterAction: string;
  createdByUserId: number | null;
  actionDateTime: Date | null;
  username: string;
}

// zod schemas
export const UserBaseFormSchema = z.object({
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number(),
  userRegionsHelpingIds: z.number().array(),
  profilePicture: z.instanceof(File).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserBaseFormType = z.infer<typeof UserBaseFormSchema>;

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type UserLoginType = z.infer<typeof UserLoginSchema>;

export const UserNewSchema = z.object({
  username: z.string(),
  email: z.string(),
  password: z.string(),
  passwordRepeated: z.string(),
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number(),
  userRegionsHelpingIds: z.number().array(),
  profilePicture: z.instanceof(File).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserNewType = z.infer<typeof UserNewSchema>;

export const UserUpdatePasswordSchema = z.object({
  oldPassword: z.string().nullable(),
  newPassword: z.string().nullable(),
  newPasswordRepeated: z.string().nullable(),
});
export type UserUpdatePasswordType = z.infer<typeof UserUpdatePasswordSchema>;

export const UserUpdatePersonalDataSchema = z.object({
  firstName: z.string(),
  secondName: z.string().nullable(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number(),
  userRegionsHelpingIds: z.number().array(),
  profilePicture: z.instanceof(File).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserUpdatePersonalDataType = z.infer<
  typeof UserUpdatePersonalDataSchema
>;

export const EventBaseFormSchema = z.object({
  eventName: z.string(),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.coerce.date(),
  eventEndDateTime: z.coerce.date().nullable(),
  regionId: z.number(),
  mainImage: z.instanceof(File).nullable(),
});
export type EventBaseFormType = z.infer<typeof EventBaseFormSchema>;

export const EventSearchFilterSchema = z.object({
  eventName: z.string().nullable(),
  pageSize: z.number(),
});
export type EventSearchFilterType = z.infer<typeof EventSearchFilterSchema>;
