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
  lastName: string;
  regionId: number;
  userRegionsHelpingIds: number[];
  secondName: string | null;
  phoneNumber: string | null;
  shortDescription: string | null;
}

export interface UserForWeb {
  userId: number;
  username: string;
  token: string;
  webSessionId: number;
  isAdmin: boolean;
  isEventCreator: boolean;
}

export interface UserView {
  canEdit: boolean;
  regionsHelping: RegionView[];
  userRegionsHelpingIds: number[];
  userRoles: RoleView[];
  userRolesIds: number[];
  userId: number;
  username: string;
  firstName: string;
  secondName: string | null;
  lastName: string;
  userFullName: string;
  email: string;
  phoneNumber: string | null;
  regionId: number;
  shortDescription: string | null;
  regionName: string;
  hasProfilePicture: boolean;
}

export interface RoleView {
  roleId: number;
  roleName: string;
  roleNameBg: string;
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
  eventStartDateTime: Date;
  regionId: number;
  eventDescription: string | null;
  eventEndDateTime: Date | null;
}

export interface EventView {
  canEdit: boolean;
  isUserSubscribed: boolean;
  subscribers: UserEventView[];
  eventId: number;
  eventName: string;
  eventDescription: string | null;
  eventStartDateTime: Date;
  eventEndDateTime: Date | null;
  regionId: number;
  createdByUserId: number;
  regionName: string;
  createdByUsername: string;
  eventCreatedAtDateTime: Date;
  hasMainImage: boolean;
}

export interface UserEventView {
  userEventId: number;
  userId: number;
  userSubscribedOnDateTime: Date;
  eventId: number;
  username: string;
  hasProfilePicture: boolean;
}

export interface CrudLogView {
  crudLogId: number;
  actionType: number;
  tableAffected: string;
  tableAffectedPrimaryKey: number;
  pocoBeforeAction: string;
  pocoAfterAction: string | null;
  createdByUserId: number | null;
  actionDateTime: Date;
  username: string;
}

// zod schemas
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
  lastName: z.string().min(1, { message: "Фамилията е задължителна." }),
  regionId: z.number().int(),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Моля, изберете региони, в които искате да помагате." }).array(),
  profilePicture: z.instanceof(FileList).nullable(),
  secondName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
});
export type UserNewType = z.infer<typeof UserNewSchema>;

export const UserUpdatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
  newPasswordRepeated: z.string(),
});
export type UserUpdatePasswordType = z.infer<typeof UserUpdatePasswordSchema>;

export const UserUpdatePersonalDataSchema = z.object({
  firstName: z.string().min(1, { message: "Името е задължително." }),
  lastName: z.string().min(1, { message: "Фамилията е задължителна." }),
  regionId: z.number().int(),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Моля, изберете региони, в които искате да помагате." }).array(),
  profilePicture: z.instanceof(FileList).nullable(),
  secondName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
});
export type UserUpdatePersonalDataType = z.infer<typeof UserUpdatePersonalDataSchema>;

export const RoleBaseFormSchema = z.object({
  userId: z.number().int().min(1, { message: "Потребителят е задължителен." }),
  rolesIds: z.number().int().array(),
});
export type RoleBaseFormType = z.infer<typeof RoleBaseFormSchema>;

export const RoleFilterSchema = z.object({
  username: z.string().min(1, { message: "Моля, въведете потребителско име" }),
});
export type RoleFilterType = z.infer<typeof RoleFilterSchema>;

export const RegionBaseFormSchema = z.object({
  regionName: z.string().min(1, { message: "Името на региона е задължително." }),
});
export type RegionBaseFormType = z.infer<typeof RegionBaseFormSchema>;

export const EventBaseFormSchema = z.object({
  eventName: z.string().min(1, { message: "Името на събитието е задължително." }).min(5, { message: "Името на събитието трябва да е поне 5 символа." }),
  eventStartDateTime: z.coerce.date().refine(date => date >= new Date("1971-01-01") && date <= new Date("3000-01-01"), { message: "Дата на събитието е задължителна." }),
  regionId: z.number().int(),
  eventDescription: z.string().nullable(),
  eventEndDateTime: z.coerce.date().nullable().nullable(),
  mainImage: z.instanceof(FileList).nullable(),
});
export type EventBaseFormType = z.infer<typeof EventBaseFormSchema>;

export const EventSearchFilterSchema = z.object({
  eventName: z.string().nullable(),
  pageSize: z.number().int().min(0, { message: "Размерът на страниците трябва да е по-голям от 0" }).max(2147483647, { message: "Размерът на страниците трябва да е по-голям от 0" }),
});
export type EventSearchFilterType = z.infer<typeof EventSearchFilterSchema>;

export const CrudLogFilterSchema = z.object({
  actionDateTime: z.coerce.date(),
  actionType: z.number().int(),
});
export type CrudLogFilterType = z.infer<typeof CrudLogFilterSchema>;

