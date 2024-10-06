namespace EventManager.Dto.CrudLog
{
    public class CrudLogDto
    {
        public long CrudLogId { get; set; }

        public int ActionType { get; set; }

        public string TableAffected { get; set; }

        public long TableAffectedPrimaryKey { get; set; }

        public string PocoBeforeAction { get; set; }

        public string PocoAfterAction { get; set; }

        public long? CreatedByUserId { get; set; }

        public DateTime ActionDateTime { get; set; }
    }
}
