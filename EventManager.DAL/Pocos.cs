using LinqToDB;
using LinqToDB.Mapping;

namespace EventManager.DAL
{
	[Table(Name = "roles")]
	public class RolePoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "role_id")]
		public virtual long RoleId { get; set; }

		[Column(Name = "role_name")]
		public virtual string RoleName { get; set; }

		[Column(Name = "role_name_bg")]
		public virtual string RoleNameBg { get; set; }

		[Column(Name = "role_created_on_date_time")]
		public virtual DateTime RoleCreatedOnDateTime { get; set; }
	}

	[Table(Name = "users_events")]
	public class UserEventPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_event_id")]
		public virtual long UserEventId { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "user_subscribed_on_date_time")]
		public virtual DateTime UserSubscribedOnDateTime { get; set; }

		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }
	}

	[Table(Name = "users_regions_helping")]
	public class UserRegionHelpingPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_region_helping_id")]
		public virtual long UserRegionHelpingId { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "user_region_created_on_date_time")]
		public virtual DateTime UserRegionCreatedOnDateTime { get; set; }
	}

	[Table(Name = "users_roles")]
	public class UserRolePoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_role_id")]
		public virtual long UserRoleId { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "role_id")]
		public virtual long RoleId { get; set; }

		[Column(Name = "user_role_created_on_date_time")]
		public virtual DateTime UserRoleCreatedOnDateTime { get; set; }
	}

	[Table(Name = "users")]
	public class UserPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "username")]
		public virtual string Username { get; set; }

		[Column(Name = "user_password")]
		public virtual string UserPassword { get; set; }

		[Column(Name = "user_first_name")]
		public virtual string UserFirstName { get; set; }

		[Nullable]
		[Column(Name = "user_second_name")]
		public virtual string UserSecondName { get; set; }

		[Column(Name = "user_last_name")]
		public virtual string UserLastName { get; set; }

		[Column(Name = "user_email")]
		public virtual string UserEmail { get; set; }

		[Nullable]
		[Column(Name = "user_phone_number")]
		public virtual string UserPhoneNumber { get; set; }

		[Nullable]
		[Column(Name = "user_email_verification_secret")]
		public virtual string UserEmailVerificationSecret { get; set; }

		[Column(Name = "user_is_email_verified")]
		public virtual bool UserIsEmailVerified { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "user_created_on_date_time")]
		public virtual DateTime UserCreatedOnDateTime { get; set; }

		[Nullable]
		[Column(Name = "user_created_by_user_id")]
		public virtual long? UserCreatedByUserId { get; set; }

		[Nullable]
		[Column(Name = "user_short_description")]
		public virtual string UserShortDescription { get; set; }

		[Nullable]
		[Column(Name = "user_profile_picture_file_id")]
		public virtual long? UserProfilePictureFileId { get; set; }
	}

	[Table(Name = "regions")]
	public class RegionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }

		[Column(Name = "region_created_on_date_time")]
		public virtual DateTime RegionCreatedOnDateTime { get; set; }
	}

	[Table(Name = "event_images")]
	public class EventImagePoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "event_image_id")]
		public virtual long EventImageId { get; set; }

		[Column(Name = "event_image_is_main")]
		public virtual bool EventImageIsMain { get; set; }

		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }

		[Column(Name = "file_id")]
		public virtual long FileId { get; set; }

		[Column(Name = "event_image_created_on_date_time")]
		public virtual DateTime EventImageCreatedOnDateTime { get; set; }
	}

	[Table(Name = "files")]
	public class FilePoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "file_id")]
		public virtual long FileId { get; set; }

		[Column(Name = "file_name")]
		public virtual string FileName { get; set; }

		[Nullable]
		[Column(Name = "file_extension")]
		public virtual string FileExtension { get; set; }

		[Column(Name = "file_storage_path")]
		public virtual string FileStoragePath { get; set; }

		[Column(Name = "file_created_on_date_time")]
		public virtual DateTime FileCreatedOnDateTime { get; set; }
	}

	[Table(Name = "crud_logs")]
	public class CrudLogPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "crud_log_id")]
		public virtual long CrudLogId { get; set; }

		[Column(Name = "crud_log_action_type")]
		public virtual int CrudLogActionType { get; set; }

		[Column(Name = "crud_log_table")]
		public virtual string CrudLogTable { get; set; }

		[Column(Name = "crud_log_table_primary_key")]
		public virtual long CrudLogTablePrimaryKey { get; set; }

		[Column(Name = "crud_log_poco_before_action")]
		public virtual string CrudLogPocoBeforeAction { get; set; }

		[Nullable]
		[Column(Name = "crud_log_poco_after_action")]
		public virtual string CrudLogPocoAfterAction { get; set; }

		[Nullable]
		[Column(Name = "crud_log_created_by_user_id")]
		public virtual long? CrudLogCreatedByUserId { get; set; }

		[Column(Name = "crud_log_created_on_date_time")]
		public virtual DateTime CrudLogCreatedOnDateTime { get; set; }
	}

	[Table(Name = "emails")]
	public class EmailPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "email_id")]
		public virtual long EmailId { get; set; }

		[Column(Name = "email_from")]
		public virtual string EmailFrom { get; set; }

		[Column(Name = "email_to")]
		public virtual string EmailTo { get; set; }

		[Column(Name = "email_subject")]
		public virtual string EmailSubject { get; set; }

		[Column(Name = "email_content")]
		public virtual string EmailContent { get; set; }

		[Column(Name = "email_created_on_date_time")]
		public virtual DateTime EmailCreatedOnDateTime { get; set; }
	}

	[Table(Name = "exceptions")]
	public class ExceptionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "exception_id")]
		public virtual long ExceptionId { get; set; }

		[Column(Name = "exception")]
		public virtual string Exception { get; set; }

		[Column(Name = "exception_message")]
		public virtual string ExceptionMessage { get; set; }

		[Column(Name = "exception_created_on_date_time")]
		public virtual DateTime ExceptionCreatedOnDateTime { get; set; }

		[Column(Name = "exception_is_resolved")]
		public virtual bool ExceptionIsResolved { get; set; }

		[Nullable]
		[Column(Name = "user_id")]
		public virtual long? UserId { get; set; }
	}

	[Table(Name = "events")]
	public class EventPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }

		[Column(Name = "event_name")]
		public virtual string EventName { get; set; }

		[Nullable]
		[Column(Name = "event_description")]
		public virtual string EventDescription { get; set; }

		[Column(Name = "event_start_date_time")]
		public virtual DateTime EventStartDateTime { get; set; }

		[Nullable]
		[Column(Name = "event_end_date_time")]
		public virtual DateTime? EventEndDateTime { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "event_created_by_user_id")]
		public virtual long EventCreatedByUserId { get; set; }

		[Column(Name = "event_created_on_date_time")]
		public virtual DateTime EventCreatedOnDateTime { get; set; }
	}

	[Table(Name = "web_sessions")]
	public class WebSessionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "web_sessions_id")]
		public virtual long WebSessionId { get; set; }

		[Column(Name = "web_session_created_on_date_time")]
		public virtual DateTime WebSessionCreatedOnDateTime { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "web_session_expires_on_date_time")]
		public virtual DateTime WebSessionExpireOnDateTime { get; set; }

		[Nullable]
		[Column(Name = "web_session_user_ip_address")]
		public virtual string WebSessionUserIpAddress { get; set; }

		[Nullable]
		[Column(Name = "web_session_logout_date_time")]
		public virtual DateTime? WebSessionLogoutDateTime { get; set; }

		[Column(Name = "web_session_revoked")]
		public virtual bool WebSessionRevoked { get; set; }

		[Nullable]
		[Column(Name = "web_session_ip_info", DataType = DataType.Json)]
		public virtual string WebSessionIpInfo { get; set; }
	}

	[Table(Name = "v_regions")]
	public class VRegionPoco
	{
		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }

		[Column(Name = "region_created_on_date_time")]
		public virtual DateTime RegionCreatedOnDateTime { get; set; }
	}

	[Table(Name = "v_events")]
	public class VEventPoco
	{
		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }

		[Column(Name = "event_name")]
		public virtual string EventName { get; set; }

		[Nullable]
		[Column(Name = "event_description")]
		public virtual string EventDescription { get; set; }

		[Column(Name = "event_start_date_time")]
		public virtual DateTime EventStartDateTime { get; set; }

		[Nullable]
		[Column(Name = "event_end_date_time")]
		public virtual DateTime? EventEndDateTime { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "event_created_by_user_id")]
		public virtual long EventCreatedByUserId { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }

		[Column(Name = "created_by_username")]
		public virtual string CreatedByUsername { get; set; }

		[Column(Name = "event_created_on_date_time")]
		public virtual DateTime EventCreatedOnDateTime { get; set; }

		[Column(Name = "has_main_image")]
		public virtual bool HasMainImage { get; set; }

		[Column(Name = "event_has_ended")]
		public virtual bool EventHasEnded { get; set; }

		[Column(Name = "event_has_started")]
		public virtual bool EventHasStarted { get; set; }
	}

	[Table(Name = "v_exceptions")]
	public class VExceptionPoco
	{
		[Column(Name = "exception_id")]
		public virtual long ExceptionId { get; set; }

		[Column(Name = "exception")]
		public virtual string Exception { get; set; }

		[Column(Name = "exception_message")]
		public virtual string ExceptionMessage { get; set; }

		[Column(Name = "exception_created_on_date_time")]
		public virtual DateTime ExceptionCreatedOnDateTime { get; set; }

		[Column(Name = "exception_is_resolved")]
		public virtual bool ExceptionIsResolved { get; set; }

		[Nullable]
		[Column(Name = "user_id")]
		public virtual long? UserId { get; set; }
	}

	[Table(Name = "v_web_sessions")]
	public class VWebSessionPoco
	{
		[Column(Name = "web_sessions_id")]
		public virtual long WebSessionId { get; set; }

		[Column(Name = "web_session_created_on_date_time")]
		public virtual DateTime WebSessionCreatedOnDateTime { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "web_session_expires_on_date_time")]
		public virtual DateTime WebSessionExpireOnDateTime { get; set; }

		[Nullable]
		[Column(Name = "web_session_user_ip_address")]
		public virtual string WebSessionUserIpAddress { get; set; }

		[Nullable]
		[Column(Name = "web_session_logout_date_time")]
		public virtual DateTime? WebSessionLogoutDateTime { get; set; }

		[Column(Name = "web_session_revoked")]
		public virtual bool WebSessionRevoked { get; set; }

		[Nullable]
		[Column(Name = "web_session_ip_info")]
		public virtual string WebSessionIpInfo { get; set; }

		[Column(Name = "ip_info_country_code")]
		public virtual string IpInfoCountryCode { get; set; }

		[Column(Name = "ip_info_country")]
		public virtual string IpInfoCountry { get; set; }

		[Column(Name = "ip_info_region_name")]
		public virtual string IpInfoRegionName { get; set; }

		[Column(Name = "ip_info_city")]
		public virtual string IpInfoCity { get; set; }

		[Column(Name = "ip_info_post_code")]
		public virtual string IpInfoPostCode { get; set; }

		[Column(Name = "ip_info_lat")]
		public virtual string IpInfoLat { get; set; }

		[Column(Name = "ip_info_lon")]
		public virtual string IpInfoLon { get; set; }
	}

	[Table(Name = "v_crud_logs")]
	public class VCrudLogPoco
	{
		[Column(Name = "crud_log_id")]
		public virtual long CrudLogId { get; set; }

		[Column(Name = "crud_log_action_type")]
		public virtual int CrudLogActionType { get; set; }

		[Column(Name = "crud_log_table")]
		public virtual string CrudLogTable { get; set; }

		[Column(Name = "crud_log_table_primary_key")]
		public virtual long CrudLogTablePrimaryKey { get; set; }

		[Column(Name = "crud_log_poco_before_action")]
		public virtual string CrudLogPocoBeforeAction { get; set; }

		[Nullable]
		[Column(Name = "crud_log_poco_after_action")]
		public virtual string CrudLogPocoAfterAction { get; set; }

		[Nullable]
		[Column(Name = "crud_log_created_by_user_id")]
		public virtual long? CrudLogCreatedByUserId { get; set; }

		[Column(Name = "crud_log_created_on_date_time")]
		public virtual DateTime CrudLogCreatedOnDateTime { get; set; }

		[Column(Name = "username")]
		public virtual string Username { get; set; }
	}

	[Table(Name = "v_users_events")]
	public class VUserEventPoco
	{
		[Column(Name = "user_event_id")]
		public virtual long UserEventId { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "user_subscribed_on_date_time")]
		public virtual DateTime UserSubscribedOnDateTime { get; set; }

		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }

		[Column(Name = "username")]
		public virtual string Username { get; set; }

		[Column(Name = "has_profile_picture")]
		public virtual bool HasProfilePicture { get; set; }
	}

	[Table(Name = "v_users")]
	public class VUserPoco
	{
		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "username")]
		public virtual string Username { get; set; }

		[Column(Name = "user_password")]
		public virtual string UserPassword { get; set; }

		[Column(Name = "user_first_name")]
		public virtual string UserFirstName { get; set; }

		[Nullable]
		[Column(Name = "user_second_name")]
		public virtual string UserSecondName { get; set; }

		[Column(Name = "user_last_name")]
		public virtual string UserLastName { get; set; }

		[Column(Name = "user_email")]
		public virtual string UserEmail { get; set; }

		[Nullable]
		[Column(Name = "user_phone_number")]
		public virtual string UserPhoneNumber { get; set; }

		[Nullable]
		[Column(Name = "user_email_verification_secret")]
		public virtual string UserEmailVerificationSecret { get; set; }

		[Column(Name = "user_is_email_verified")]
		public virtual bool UserIsEmailVerified { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "user_created_on_date_time")]
		public virtual DateTime UserCreatedOnDateTime { get; set; }

		[Nullable]
		[Column(Name = "user_created_by_user_id")]
		public virtual long? UserCreatedByUserId { get; set; }

		[Nullable]
		[Column(Name = "user_short_description")]
		public virtual string UserShortDescription { get; set; }

		[Nullable]
		[Column(Name = "user_profile_picture_file_id")]
		public virtual long? UserProfilePictureFileId { get; set; }

		[Column(Name = "user_full_name")]
		public virtual string UserFullName { get; set; }

		[Column(Name = "has_profile_picture")]
		public virtual bool HasProfilePicture { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }

		[Column(Name = "file_storage_path")]
		public virtual string FileStoragePath { get; set; }
	}

	[Table(Name = "v_event_images")]
	public class VEventImagePoco
	{
		[Column(Name = "event_image_id")]
		public virtual long EventImageId { get; set; }

		[Column(Name = "event_image_is_main")]
		public virtual bool EventImageIsMain { get; set; }

		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }

		[Column(Name = "file_id")]
		public virtual long FileId { get; set; }

		[Column(Name = "event_image_created_on_date_time")]
		public virtual DateTime EventImageCreatedOnDateTime { get; set; }

		[Column(Name = "file_storage_path")]
		public virtual string FileStoragePath { get; set; }
	}

}
