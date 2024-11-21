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
  userFirstName: string;
  userSecondName: string | null;
  userLastName: string;
  regionId: number;
  userPhoneNumber: string | null;
  userShortDescription: string | null;
  userRegionsHelpingIds: number[];
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
  userFirstName: string;
  userSecondName: string | null;
  userLastName: string;
  userEmail: string;
  userPhoneNumber: string | null;
  regionId: number;
  userShortDescription: string | null;
  userFullName: string;
  hasProfilePicture: boolean;
  regionName: string;
  fileStoragePath: string;
}

export interface RoleView {
  roleId: number;
  roleName: string;
  roleNameBg: string;
}

export interface RegionView {
  regionId: number;
  regionName: string;
  regionCreatedOnDateTime: Date;
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
  eventCreatedByUserId: number;
  regionName: string;
  createdByUsername: string;
  eventCreatedOnDateTime: Date;
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
  crudLogActionType: number;
  crudLogTable: string;
  crudLogTablePrimaryKey: number;
  crudLogPocoBeforeAction: string;
  crudLogPocoAfterAction: string | null;
  crudLogCreatedByUserId: number | null;
  crudLogCreatedOnDateTime: Date;
  username: string;
}

// zod schemas
export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: "Потребителско име е задължително." }),
  password: z.string().min(1, { message: "Паролата е задължителна." }),
});
export type UserLoginType = z.infer<typeof UserLoginSchema>;

export const UserNewSchema = z.object({
  username: z.string().min(1, { message: "Потребителско име е задължително" }),
  userEmail: z.string().email({ message: "Имейлът е задължителен" }),
  userPassword: z.string().min(1, { message: "Паролата е задължителна" }),
  passwordRepeated: z.string().min(1, { message: "Повторете отново паролата" }),
  userFirstName: z.string().min(1, { message: "Името е задължително" }),
  userSecondName: z.string().nullable(),
  userLastName: z.string().min(1, { message: "Фамилията е задължителна" }),
  userPhoneNumber: z.string().nullable(),
  regionId: z.number().int().min(1, { message: "Изберете регион, в който живеете" }),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Изберете поне един регион, в коойто искате да помагате" }).array(),
  profilePicture: z.instanceof(FileList).nullable(),
  userShortDescription: z.string().nullable(),
});
export type UserNewType = z.infer<typeof UserNewSchema>;

export const UserUpdatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Текущата парола е задължителна" }),
  newPassword: z.string().min(1, { message: "Новата парола е задължителна" }),
  newPasswordRepeated: z.string().min(1, { message: "Повторете отново новата парола" }),
});
export type UserUpdatePasswordType = z.infer<typeof UserUpdatePasswordSchema>;

export const UserUpdatePersonalDataSchema = z.object({
  userFirstName: z.string().min(1, { message: "Името е задължително" }),
  userSecondName: z.string().nullable(),
  userLastName: z.string().min(1, { message: "Фамилията е задължителна" }),
  regionId: z.number().int().min(1, { message: "Изберете регион, в който живеете" }),
  userPhoneNumber: z.string().nullable(),
  userShortDescription: z.string().nullable(),
  profilePicture: z.instanceof(FileList).nullable(),
  userRegionsHelpingIds: z.number().int().min(1, { message: "Изберете поне един регион, в коойто искате да помагате" }).array(),
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
  regionCreatedOnDateTime: z.coerce.date(),
});
export type RegionBaseFormType = z.infer<typeof RegionBaseFormSchema>;

export const EventBaseFormSchema = z.object({
  eventName: z.string().min(1, { message: "Името на събитието е задължително." }),
  eventStartDateTime: z.coerce.date().refine(date => date >= new Date("1971-01-01") && date <= new Date("3000-01-01"), { message: "Дата на събитието е задължителна." }),
  regionId: z.number().int().min(1, { message: "Регионът на събитието е задължителен." }).max(9.223372036854776E+18, { message: "Регионът на събитието е задължителен." }),
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

