using LinqToDB.Mapping;

namespace EventManager.DAL
{
	[Table(Name = "regions")]
	public class RegionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }
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
	}

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
	}

	[Table(Name = "event_images")]
	public class EventImagePoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "image_id")]
		public virtual long ImageId { get; set; }

		[Column(Name = "image_name")]
		public virtual string ImageName { get; set; }

		[Column(Name = "image_extension")]
		public virtual string ImageExtension { get; set; }

		[Column(Name = "image_file_path")]
		public virtual string ImageFilePath { get; set; }

		[Column(Name = "image_is_main")]
		public virtual bool ImageIsMain { get; set; }

		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }
	}

	[Table(Name = "users")]
	public class UserPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "username")]
		public virtual string Username { get; set; }

		[Column(Name = "password")]
		public virtual string Password { get; set; }

		[Column(Name = "first_name")]
		public virtual string FirstName { get; set; }

		[Column(Name = "second_name")]
		public virtual string SecondName { get; set; }

		[Column(Name = "last_name")]
		public virtual string LastName { get; set; }

		[Column(Name = "email")]
		public virtual string Email { get; set; }

		[Column(Name = "phone_number")]
		public virtual string PhoneNumber { get; set; }

		[Column(Name = "email_verification_secret")]
		public virtual string EmailVerificationSecret { get; set; }

		[Column(Name = "is_email_verified")]
		public virtual bool IsEmailVerified { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "created_on_date_time")]
		public virtual DateTime CreatedOnDateTime { get; set; }

		[Column(Name = "created_by_user_id")]
		public virtual long? CreatedByUserId { get; set; }

		[Column(Name = "profile_picture_path")]
		public virtual string ProfilePicturePath { get; set; }

		[Column(Name = "short_description")]
		public virtual string ShortDescription { get; set; }
	}

	[Table(Name = "crud_logs")]
	public class CrudLogPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "crud_log_id")]
		public virtual long CrudLogId { get; set; }

		[Column(Name = "action_type")]
		public virtual int ActionType { get; set; }

		[Column(Name = "table_affected")]
		public virtual string TableAffected { get; set; }

		[Column(Name = "table_affected_primary_key")]
		public virtual long TableAffectedPrimaryKey { get; set; }

		[Column(Name = "poco_before_action")]
		public virtual string PocoBeforeAction { get; set; }

		[Column(Name = "poco_after_action")]
		public virtual string PocoAfterAction { get; set; }

		[Column(Name = "created_by_user_id")]
		public virtual long? CreatedByUserId { get; set; }

		[Column(Name = "action_date_time")]
		public virtual DateTime ActionDateTime { get; set; }
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

		[Column(Name = "exception_date_time")]
		public virtual DateTime ExceptionDateTime { get; set; }

		[Column(Name = "is_resolved")]
		public virtual bool IsResolved { get; set; }

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

		[Column(Name = "event_description")]
		public virtual string EventDescription { get; set; }

		[Column(Name = "event_start_date_time")]
		public virtual DateTime EventStartDateTime { get; set; }

		[Column(Name = "event_end_date_time")]
		public virtual DateTime? EventEndDateTime { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "created_by_user_id")]
		public virtual long CreatedByUserId { get; set; }

		[Column(Name = "event_created_at_date_time")]
		public virtual DateTime EventCreatedAtDateTime { get; set; }
	}

	[Table(Name = "web_sessions")]
	public class WebSessionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "web_sessions_id")]
		public virtual long WebSessionId { get; set; }

		[Column(Name = "login_date_time")]
		public virtual DateTime LoginDateTime { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "expires_on_date_time")]
		public virtual DateTime ExpireOnDateTime { get; set; }

		[Column(Name = "user_ip_address")]
		public virtual string UserIpAddress { get; set; }

		[Column(Name = "logout_date_time")]
		public virtual DateTime? LogoutDateTime { get; set; }
	}

	[Table(Name = "v_regions")]
	public class VRegionPoco
	{
		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }
	}

	[Table(Name = "v_web_sessions")]
	public class VWebSessionPoco
	{
		[Column(Name = "web_sessions_id")]
		public virtual long WebSessionId { get; set; }

		[Column(Name = "login_date_time")]
		public virtual DateTime LoginDateTime { get; set; }

		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "expires_on_date_time")]
		public virtual DateTime ExpireOnDateTime { get; set; }

		[Column(Name = "user_ip_address")]
		public virtual string UserIpAddress { get; set; }

		[Column(Name = "logout_date_time")]
		public virtual DateTime? LogoutDateTime { get; set; }
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

		[Column(Name = "exception_date_time")]
		public virtual DateTime ExceptionDateTime { get; set; }

		[Column(Name = "is_resolved")]
		public virtual bool IsResolved { get; set; }

		[Column(Name = "user_id")]
		public virtual long? UserId { get; set; }
	}

	[Table(Name = "v_users")]
	public class VUserPoco
	{
		[Column(Name = "user_id")]
		public virtual long UserId { get; set; }

		[Column(Name = "username")]
		public virtual string Username { get; set; }

		[Column(Name = "password")]
		public virtual string Password { get; set; }

		[Column(Name = "first_name")]
		public virtual string FirstName { get; set; }

		[Column(Name = "second_name")]
		public virtual string SecondName { get; set; }

		[Column(Name = "last_name")]
		public virtual string LastName { get; set; }

		[Column(Name = "user_full_name")]
		public virtual string UserFullName { get; set; }

		[Column(Name = "email")]
		public virtual string Email { get; set; }

		[Column(Name = "phone_number")]
		public virtual string PhoneNumber { get; set; }

		[Column(Name = "email_verification_secret")]
		public virtual string EmailVerificationSecret { get; set; }

		[Column(Name = "is_email_verified")]
		public virtual bool IsEmailVerified { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "created_on_date_time")]
		public virtual DateTime CreatedOnDateTime { get; set; }

		[Column(Name = "created_by_user_id")]
		public virtual long? CreatedByUserId { get; set; }

		[Column(Name = "profile_picture_path")]
		public virtual string ProfilePicturePath { get; set; }

		[Column(Name = "short_description")]
		public virtual string ShortDescription { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }

		[Column(Name = "has_profile_picture")]
		public virtual bool HasProfilePicture { get; set; }
	}

	[Table(Name = "v_crud_logs")]
	public class VCrudLogPoco
	{
		[Column(Name = "crud_log_id")]
		public virtual long CrudLogId { get; set; }

		[Column(Name = "action_type")]
		public virtual int ActionType { get; set; }

		[Column(Name = "table_affected")]
		public virtual string TableAffected { get; set; }

		[Column(Name = "table_affected_primary_key")]
		public virtual long TableAffectedPrimaryKey { get; set; }

		[Column(Name = "poco_before_action")]
		public virtual string PocoBeforeAction { get; set; }

		[Column(Name = "poco_after_action")]
		public virtual string PocoAfterAction { get; set; }

		[Column(Name = "created_by_user_id")]
		public virtual long? CreatedByUserId { get; set; }

		[Column(Name = "action_date_time")]
		public virtual DateTime ActionDateTime { get; set; }

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

	[Table(Name = "v_events")]
	public class VEventPoco
	{
		[Column(Name = "event_id")]
		public virtual long EventId { get; set; }

		[Column(Name = "event_name")]
		public virtual string EventName { get; set; }

		[Column(Name = "event_description")]
		public virtual string EventDescription { get; set; }

		[Column(Name = "event_start_date_time")]
		public virtual DateTime EventStartDateTime { get; set; }

		[Column(Name = "event_end_date_time")]
		public virtual DateTime? EventEndDateTime { get; set; }

		[Column(Name = "region_id")]
		public virtual long RegionId { get; set; }

		[Column(Name = "created_by_user_id")]
		public virtual long CreatedByUserId { get; set; }

		[Column(Name = "region_name")]
		public virtual string RegionName { get; set; }

		[Column(Name = "created_by_username")]
		public virtual string CreatedByUsername { get; set; }

		[Column(Name = "event_created_at_date_time")]
		public virtual DateTime EventCreatedAtDateTime { get; set; }

		[Column(Name = "has_main_image")]
		public virtual bool HasMainImage { get; set; }
	}

}
