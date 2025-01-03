using LinqToDB;
using LinqToDB.Data;

namespace EventManager.DAL
{
	public partial class PostgresConnection : DataConnection
	{
		public PostgresConnection(DataOptions<PostgresConnection> options) : base(options.Options) { }

		public IQueryable<RolePoco> Roles => DataExtensions.GetTable<RolePoco>(this);
		public IQueryable<UserEventPoco> UsersEvents => DataExtensions.GetTable<UserEventPoco>(this);
		public IQueryable<UserRegionHelpingPoco> UsersRegionsHelping => DataExtensions.GetTable<UserRegionHelpingPoco>(this);
		public IQueryable<UserRolePoco> UsersRoles => DataExtensions.GetTable<UserRolePoco>(this);
		public IQueryable<UserPoco> Users => DataExtensions.GetTable<UserPoco>(this);
		public IQueryable<RegionPoco> Regions => DataExtensions.GetTable<RegionPoco>(this);
		public IQueryable<EventImagePoco> EventImages => DataExtensions.GetTable<EventImagePoco>(this);
		public IQueryable<FilePoco> Files => DataExtensions.GetTable<FilePoco>(this);
		public IQueryable<CrudLogPoco> CrudLogs => DataExtensions.GetTable<CrudLogPoco>(this);
		public IQueryable<ExceptionPoco> Exceptions => DataExtensions.GetTable<ExceptionPoco>(this);
		public IQueryable<EventPoco> Events => DataExtensions.GetTable<EventPoco>(this);
		public IQueryable<WebSessionPoco> WebSessions => DataExtensions.GetTable<WebSessionPoco>(this);
		public IQueryable<VRegionPoco> VRegions => DataExtensions.GetTable<VRegionPoco>(this);
		public IQueryable<VEventPoco> VEvents => DataExtensions.GetTable<VEventPoco>(this);
		public IQueryable<VExceptionPoco> VExceptions => DataExtensions.GetTable<VExceptionPoco>(this);
		public IQueryable<VWebSessionPoco> VWebSessions => DataExtensions.GetTable<VWebSessionPoco>(this);
		public IQueryable<VCrudLogPoco> VCrudLogs => DataExtensions.GetTable<VCrudLogPoco>(this);
		public IQueryable<VUserEventPoco> VUsersEvents => DataExtensions.GetTable<VUserEventPoco>(this);
		public IQueryable<VUserPoco> VUsers => DataExtensions.GetTable<VUserPoco>(this);
		public IQueryable<VEventImagePoco> VEventImages => DataExtensions.GetTable<VEventImagePoco>(this);
	}
}
