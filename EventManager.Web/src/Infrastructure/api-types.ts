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

export interface WebSessionView {
  webSessionId: number;
  webSessionCreatedOnDateTime: Date;
  userId: number;
  webSessionExpireOnDateTime: Date;
  webSessionUserIpAddress: string | null;
  webSessionLogoutDateTime: Date | null;
  webSessionRevoked: boolean;
  ipInfoCountryCode: string;
  ipInfoCountry: string;
  ipInfoRegionName: string;
  ipInfoCity: string;
  ipInfoPostCode: string;
  ipInfoLat: string;
  ipInfoLon: string;
}

export interface UserForUpdate {
  hasProfilePicture: boolean;
  username: string;
  userFirstName: string;
  userSecondName: string | null;
  userLastName: string;
  profilePictureUrl: string;
  regionId: number;
  userPhoneNumber: string | null;
  userShortDescription: string | null;
  userRegionsHelpingIds: number[];
  webSessions: WebSessionView[];
}

export interface UserForWeb {
  userId: number;
  username: string;
  token: string;
  webSessionId: number;
  isAdmin: boolean;
  isEventCreator: boolean;
  profilePictureUrl: string;
}

export interface UserSearch {
  userId: number;
  username: string;
  userFullName: string;
  profilePictureUrl: string;
}

export interface UserUpdatePersonalDataResponse {
  profilePictureUrl: string;
}

export interface UserVerifyEmail {
  userId: number;
  emailVerificationSecret: string;
}

export interface UserView {
  canEdit: boolean;
  regionsHelping: RegionView[];
  userRegionsHelpingIds: number[];
  userRoles: RoleView[];
  userRolesIds: number[];
  profilePictureUrl: string;
  userId: number;
  username: string;
  userFirstName: string;
  userSecondName: string | null;
  userLastName: string;
  userEmail: string;
  userPhoneNumber: string | null;
  regionId: number;
  userShortDescription: string | null;
  userProfilePictureFileId: number | null;
  userFullName: string;
  regionName: string;
  userProfilePictureRelativePath: string;
}

export interface RoleView {
  roleId: number;
  roleName: string;
  roleNameBg: string;
}

export interface RegionForUpdate {
  regionName: string;
}

export interface RegionView {
  regionId: number;
  regionName: string;
  regionCreatedOnDateTime: Date;
}

export interface OrganizationForUpdate {
  organizationLogoUrl: string;
  organizationName: string;
  organizationDescription: string;
}

export interface OrganizationUsersNew {
  usersIds: number[];
}

export interface OrganizationView {
  organizationLogoUrl: string;
  isUserSubscribed: boolean;
  canEdit: boolean;
  organizationId: number;
  organizationName: string;
  organizationDescription: string;
  organizationLogoFileId: number;
  organizationCreatedOnDateTime: Date;
  organizationCreatedByUserId: number;
  fileStorageRelativePath: string;
}

export interface UserOrganizationView {
  userProfilePictureUrl: string;
  userOrganizationId: number;
  userId: number;
  organizationId: number;
  userOrganizationCreatedOnDateTime: Date | null;
  username: string;
  organizationName: string;
  userProfilePictureRelativePath: string;
  userFullName: string;
}

export interface HomeView {
  incommingEvents: EventView[];
}

export interface EventForUpdate {
  mainImageUrl: string;
  eventName: string;
  eventStartDateTime: Date;
  regionId: number;
  organizationId: number;
  eventDescription: string | null;
  eventEndDateTime: Date | null;
}

export interface EventView {
  canEdit: boolean;
  isUserSubscribed: boolean;
  mainImageUrl: string;
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
  eventHasEnded: boolean;
  eventHasStarted: boolean;
  mainImageRelativePath: string;
  organizationName: string;
  organizationId: number;
}

export interface UserEventView {
  userProfilePictureUrl: string;
  userEventId: number;
  userId: number;
  userSubscribedOnDateTime: Date;
  eventId: number;
  username: string;
  userProfilePictureRelativePath: string;
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

export const UserSearchFilterSchema = z.object({
  username: z.string().min(1, { message: "Потребителското име е задължително" }),
});
export type UserSearchFilterType = z.infer<typeof UserSearchFilterSchema>;

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

export const UserUpdateUsernameSchema = z.object({
  username: z.string().min(1, { message: "Потребителско име е задължително" }),
});
export type UserUpdateUsernameType = z.infer<typeof UserUpdateUsernameSchema>;

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

export const OrganizationBaseFormSchema = z.object({
  organizationName: z.string().min(1, { message: "Името на организацията е задължително" }),
  organizationDescription: z.string().min(1, { message: "Описанието на организацията е задължително" }),
  organizationLogoFile: z.instanceof(FileList),
});
export type OrganizationBaseFormType = z.infer<typeof OrganizationBaseFormSchema>;

export const OrganizationNewSchema = z.object({
  organizationLogoFile: z.instanceof(FileList).refine(fileList => fileList && fileList.length > 0, { message: "Логото на организацията е задължително" }).refine(fileList => { if (fileList && fileList.length > 0) { return Array.from(fileList).every(file => file.size <= 1048576); } return true; }, { message: "Максималният размер за файл е 1MB" }),
  organizationName: z.string().min(1, { message: "Името на организацията е задължително" }),
  organizationDescription: z.string().min(1, { message: "Описанието на организацията е задължително" }),
});
export type OrganizationNewType = z.infer<typeof OrganizationNewSchema>;

export const OrganizationUpdateSchema = z.object({
  organizationLogoFile: z.instanceof(FileList).refine(fileList => { if (fileList && fileList.length > 0) { return Array.from(fileList).every(file => file.size <= 1048576); } return true; }, { message: "Максималният размер за файл е 1MB" }),
  organizationName: z.string().min(1, { message: "Името на организацията е задължително" }),
  organizationDescription: z.string().min(1, { message: "Описанието на организацията е задължително" }),
});
export type OrganizationUpdateType = z.infer<typeof OrganizationUpdateSchema>;

export const EventBaseFormSchema = z.object({
  eventName: z.string().min(1, { message: "Името на събитието е задължително." }),
  eventStartDateTime: z.coerce.date().refine(date => date >= new Date("1971-01-01") && date <= new Date("3000-01-01"), { message: "Дата на събитието е задължителна." }),
  regionId: z.number().int().min(1, { message: "Регионът на събитието е задължителен." }).max(9.223372036854776E+18, { message: "Регионът на събитието е задължителен." }),
  organizationId: z.number().int(),
  eventDescription: z.string().nullable(),
  eventEndDateTime: z.coerce.date().nullable(),
  mainImage: z.instanceof(FileList).nullable().refine(fileList => { if (fileList && fileList.length > 0) { return Array.from(fileList).every(file => file.size <= 1048576); } return true; }, { message: "Максималният размер за файл е 1MB" }),
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

