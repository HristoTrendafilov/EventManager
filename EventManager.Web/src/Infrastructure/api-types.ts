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

export interface RoleView {
  roleId: number;
  roleName: string;
  roleNameBg: string;
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
  userRoles: RoleView[];
  userRolesIds: number[];
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
  firstName: z.string().min(1, { message: "Името е задължително." }),
  secondName: z.string().nullable(),
  lastName: z.string().min(1, { message: "Фамилията е задължителна." }),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number().int(),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Моля, изберете региони, в които искате да помагате." }).array(),
  profilePicture: z.instanceof(File).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserBaseFormType = z.infer<typeof UserBaseFormSchema>;

export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: "Потребителско име е задължително." }),
  password: z.string().min(1, { message: "Паролата е задължителна." }),
});
export type UserLoginType = z.infer<typeof UserLoginSchema>;

export const UserNewSchema = z.object({
  username: z.string().min(1, { message: "Потребителско име е задължително." }),
  email: z.string().email({ message: "Имейлът е задължителен." }),
  password: z.string().min(1, { message: "Паролата е задължителна." }),
  passwordRepeated: z.string().min(1, { message: "Моля, повторете отново паролата" }),
  firstName: z.string().min(1, { message: "Името е задължително." }),
  secondName: z.string().nullable(),
  lastName: z.string().min(1, { message: "Фамилията е задължителна." }),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number().int(),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Моля, изберете региони, в които искате да помагате." }).array(),
  profilePicture: z.instanceof(File).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserNewType = z.infer<typeof UserNewSchema>;

export const UserRoleBaseFormSchema = z.object({
  userId: z.number().int().min(1, { message: "Потребителят е задължителен." }),
  rolesIds: z.number().int().nullable().array(),
});
export type UserRoleBaseFormType = z.infer<typeof UserRoleBaseFormSchema>;

export const UserRoleFilterSchema = z.object({
  username: z.string().nullable(),
});
export type UserRoleFilterType = z.infer<typeof UserRoleFilterSchema>;

export const UserUpdatePasswordSchema = z.object({
  oldPassword: z.string().nullable(),
  newPassword: z.string().nullable(),
  newPasswordRepeated: z.string().nullable(),
});
export type UserUpdatePasswordType = z.infer<typeof UserUpdatePasswordSchema>;

export const UserUpdatePersonalDataSchema = z.object({
  firstName: z.string().min(1, { message: "Името е задължително." }),
  secondName: z.string().nullable(),
  lastName: z.string().min(1, { message: "Фамилията е задължителна." }),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number().int(),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Моля, изберете региони, в които искате да помагате." }).array(),
  profilePicture: z.instanceof(File).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserUpdatePersonalDataType = z.infer<typeof UserUpdatePersonalDataSchema>;

export const EventBaseFormSchema = z.object({
  eventName: z.string().min(1, { message: "Името на събитието е задължително." }).min(5, { message: "Името на събитието трябва да е поне 5 символа." }),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.coerce.date(),
  eventEndDateTime: z.coerce.date().nullable().nullable(),
  regionId: z.number().int(),
  mainImage: z.instanceof(File).nullable(),
});
export type EventBaseFormType = z.infer<typeof EventBaseFormSchema>;

export const EventSearchFilterSchema = z.object({
  eventName: z.string().nullable(),
  pageSize: z.number().int().min(0, { message: "Размерът на страниците трябва да е по-голям от 0" }).max(2147483647, { message: "Размерът на страниците трябва да е по-голям от 0" }),
});
export type EventSearchFilterType = z.infer<typeof EventSearchFilterSchema>;

