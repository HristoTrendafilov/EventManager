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
  secondName: string;
  lastName: string;
  userFullName: string;
  email: string;
  phoneNumber: string;
  regionId: number;
  shortDescription: string;
  regionName: string;
  hasProfilePicture: boolean;
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
}

export interface EventView {
  canEdit: boolean;
  isUserSubscribed: boolean;
  subscribers: UserEventView[];
  eventId: number;
  eventName: string;
  eventDescription: string;
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
  pocoAfterAction: string;
  createdByUserId: number | null;
  actionDateTime: Date;
  username: string;
}

// zod schemas
export const UserBaseFormSchema = z.object({
  firstName: z.string().min(1, { message: 'Името е задължително.' }),
  secondName: z.string().nullable(),
  lastName: z.string().min(1, { message: 'Фамилията е задължителна.' }),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number().int(),
  userRegionsHelpingIds: z
    .number()
    .int()
    .min(1, { message: 'Моля, изберете региони, в които искате да помагате.' })
    .array(),
  profilePicture: z.instanceof(FileList).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserBaseFormType = z.infer<typeof UserBaseFormSchema>;

export const UserLoginSchema = z.object({
  username: z.string().min(1, { message: 'Потребителско име е задължително.' }),
  password: z.string().min(1, { message: 'Паролата е задължителна.' }),
});
export type UserLoginType = z.infer<typeof UserLoginSchema>;

export const UserNewSchema = z.object({
  username: z.string().min(1, { message: 'Потребителско име е задължително.' }),
  email: z.string().email({ message: 'Имейлът е задължителен.' }),
  password: z.string().min(1, { message: 'Паролата е задължителна.' }),
  passwordRepeated: z
    .string()
    .min(1, { message: 'Моля, повторете отново паролата' }),
  firstName: z.string().min(1, { message: 'Името е задължително.' }),
  secondName: z.string().nullable(),
  lastName: z.string().min(1, { message: 'Фамилията е задължителна.' }),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number().int(),
  userRegionsHelpingIds: z
    .number()
    .int()
    .min(1, { message: 'Моля, изберете региони, в които искате да помагате.' })
    .array(),
  profilePicture: z.instanceof(FileList).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserNewType = z.infer<typeof UserNewSchema>;

export const UserRoleBaseFormSchema = z.object({
  userId: z.number().int().min(1, { message: 'Потребителят е задължителен.' }),
  rolesIds: z.number().int().nullable().array(),
});
export type UserRoleBaseFormType = z.infer<typeof UserRoleBaseFormSchema>;

export const UserRoleFilterSchema = z.object({
  username: z.string().min(1, { message: 'Моля, въведете потребителско име' }),
});
export type UserRoleFilterType = z.infer<typeof UserRoleFilterSchema>;

export const UserUpdatePasswordSchema = z.object({
  oldPassword: z.string().nullable(),
  newPassword: z.string().nullable(),
  newPasswordRepeated: z.string().nullable(),
});
export type UserUpdatePasswordType = z.infer<typeof UserUpdatePasswordSchema>;

export const UserUpdatePersonalDataSchema = z.object({
  firstName: z.string().min(1, { message: 'Името е задължително.' }),
  secondName: z.string().nullable(),
  lastName: z.string().min(1, { message: 'Фамилията е задължителна.' }),
  phoneNumber: z.string().nullable(),
  shortDescription: z.string().nullable(),
  regionId: z.number().int(),
  userRegionsHelpingIds: z
    .number()
    .int()
    .min(1, { message: 'Моля, изберете региони, в които искате да помагате.' })
    .array(),
  profilePicture: z.instanceof(FileList).nullable(),
  profilePicturePath: z.string().nullable(),
});
export type UserUpdatePersonalDataType = z.infer<
  typeof UserUpdatePersonalDataSchema
>;

export const RegionBaseFormSchema = z.object({
  regionName: z
    .string()
    .min(1, { message: 'Името на региона е задължително.' }),
});
export type RegionBaseFormType = z.infer<typeof RegionBaseFormSchema>;

export const EventBaseFormSchema = z.object({
  eventName: z
    .string()
    .min(1, { message: 'Името на събитието е задължително.' })
    .min(5, { message: 'Името на събитието трябва да е поне 5 символа.' }),
  eventDescription: z.string().nullable(),
  eventStartDateTime: z.coerce
    .date()
    .refine(
      (date) =>
        date >= new Date('1971-01-01') && date <= new Date('3000-01-01'),
      { message: 'Дата на събитието е задължителна.' }
    ),
  eventEndDateTime: z.coerce.date().nullable().nullable(),
  regionId: z.number().int(),
  mainImage: z.instanceof(FileList).nullable(),
});
export type EventBaseFormType = z.infer<typeof EventBaseFormSchema>;

export const EventSearchFilterSchema = z.object({
  eventName: z.string().nullable(),
  pageSize: z
    .number()
    .int()
    .min(0, { message: 'Размерът на страниците трябва да е по-голям от 0' })
    .max(2147483647, {
      message: 'Размерът на страниците трябва да е по-голям от 0',
    }),
});
export type EventSearchFilterType = z.infer<typeof EventSearchFilterSchema>;

export const CrudLogFilterSchema = z.object({
  actionDateTime: z.coerce.date().nullable(),
  actionType: z.number().int().nullable(),
});
export type CrudLogFilterType = z.infer<typeof CrudLogFilterSchema>;
