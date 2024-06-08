using LinqToDB.Mapping;

namespace EventManager.DAL
{
	[Table(Name = "regions")]
	public class RegionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "region_id")]
		public long RegionId { get; set; }

		[Column(Name = "region_name")]
		public string RegionName { get; set; }
	}

	[Table(Name = "claims")]
	public class ClaimPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "claim_id")]
		public long ClaimId { get; set; }

		[Column(Name = "claim_name")]
		public string ClaimName { get; set; }

		[Column(Name = "claim_type")]
		public string ClaimType { get; set; }
	}

	[Table(Name = "users")]
	public class UserPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_id")]
		public long UserId { get; set; }

		[Column(Name = "username")]
		public string Username { get; set; }

		[Column(Name = "password")]
		public string Password { get; set; }

		[Column(Name = "first_name")]
		public string FirstName { get; set; }

		[Column(Name = "second_name")]
		public string SecondName { get; set; }

		[Column(Name = "last_name")]
		public string LastName { get; set; }

		[Column(Name = "email")]
		public string Email { get; set; }

		[Column(Name = "phone_number")]
		public string PhoneNumber { get; set; }

		[Column(Name = "email_verification_secret")]
		public string EmailVerificationSecret { get; set; }

		[Column(Name = "is_email_verified")]
		public bool IsEmailVerified { get; set; }

		[Column(Name = "region_id")]
		public long? RegionId { get; set; }

		[Column(Name = "created_on_date_time")]
		public DateTime CreatedOnDateTime { get; set; }

		[Column(Name = "created_by_user_id")]
		public long? CreatedByUserId { get; set; }
	}

	[Table(Name = "users_regions_helping")]
	public class UserRegionHelpingPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_region_helping_id")]
		public long UserRegionHelpingId { get; set; }

		[Column(Name = "user_id")]
		public long UserId { get; set; }

		[Column(Name = "region_id")]
		public long RegionId { get; set; }
	}

	[Table(Name = "users_claims")]
	public class UserClaimPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_claim_id")]
		public long UserClaimId { get; set; }

		[Column(Name = "user_id")]
		public long UserId { get; set; }

		[Column(Name = "claim_id")]
		public long ClaimId { get; set; }
	}

	[Table(Name = "users_events")]
	public class UserEventPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "user_event_id")]
		public long UserEventId { get; set; }

		[Column(Name = "user_id")]
		public long UserId { get; set; }

		[Column(Name = "user_subscribed_on_date_time")]
		public DateTime UserSubscribedOnDateTime { get; set; }

		[Column(Name = "event_id")]
		public long EventId { get; set; }
	}

	[Table(Name = "images")]
	public class ImagePoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "image_id")]
		public long ImageId { get; set; }

		[Column(Name = "image_name")]
		public string ImageName { get; set; }

		[Column(Name = "image_extension")]
		public string ImageExtension { get; set; }

		[Column(Name = "image_file_path")]
		public string ImageFilePath { get; set; }

		[Column(Name = "image_is_main")]
		public bool ImageIsMain { get; set; }

		[Column(Name = "event_id")]
		public long EventId { get; set; }
	}

	[Table(Name = "crud_logs")]
	public class CrudLogPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "crud_log_id")]
		public long CrudLogId { get; set; }

		[Column(Name = "action_type")]
		public int ActionType { get; set; }

		[Column(Name = "table_affected")]
		public string TableAffected { get; set; }

		[Column(Name = "table_affected_primary_key")]
		public long TableAffectedPrimaryKey { get; set; }

		[Column(Name = "poco_before_action")]
		public string PocoBeforeAction { get; set; }

		[Column(Name = "poco_after_action")]
		public string PocoAfterAction { get; set; }

		[Column(Name = "created_by_user_id")]
		public long? CreatedByUserId { get; set; }

		[Column(Name = "action_date_time")]
		public DateTime ActionDateTime { get; set; }
	}

	[Table(Name = "exceptions")]
	public class ExceptionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "exception_id")]
		public long ExceptionId { get; set; }

		[Column(Name = "exception")]
		public string Exception { get; set; }

		[Column(Name = "exception_message")]
		public string ExceptionMessage { get; set; }

		[Column(Name = "exception_date_time")]
		public DateTime ExceptionDateTime { get; set; }

		[Column(Name = "is_resolved")]
		public bool IsResolved { get; set; }

		[Column(Name = "user_id")]
		public long? UserId { get; set; }
	}

	[Table(Name = "events")]
	public class EventPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "event_id")]
		public long EventId { get; set; }

		[Column(Name = "event_name")]
		public string EventName { get; set; }

		[Column(Name = "event_description")]
		public string EventDescription { get; set; }

		[Column(Name = "event_start_date_time")]
		public DateTime EventStartDateTime { get; set; }

		[Column(Name = "event_end_date_time")]
		public DateTime? EventEndDateTime { get; set; }

		[Column(Name = "region_id")]
		public long RegionId { get; set; }

		[Column(Name = "created_by_user_id")]
		public long CreatedByUserId { get; set; }
	}

	[Table(Name = "web_sessions")]
	public class WebSessionPoco
	{
		[PrimaryKey, Identity]
		[Column(Name = "web_sessions_id")]
		public long WebSessionId { get; set; }

		[Column(Name = "login_date_time")]
		public DateTime LoginDateTime { get; set; }

		[Column(Name = "user_id")]
		public long UserId { get; set; }

		[Column(Name = "expires_on_date_time")]
		public DateTime ExpireOnDateTime { get; set; }

		[Column(Name = "user_ip_address")]
		public string UserIpAddress { get; set; }

		[Column(Name = "logout_date_time")]
		public DateTime? LogoutDateTime { get; set; }
	}

}
