using LinqToDB.Mapping;

namespace EventManager.API.Dto.Exception
{
    public class ExceptionBaseForm
    {
        public string Exception { get; set; }

        public string ExceptionMessage { get; set; }

        public DateTime ExceptionCreatedOnDateTime { get; set; }

        public bool ExceptionIsResolved { get; set; }

        [Nullable]
        public long? UserId { get; set; }
    }
}
