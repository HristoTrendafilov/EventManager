namespace EventManager.API.Dto.Exception
{
    public class ExceptionNew : ExceptionBaseForm
    {
        public ExceptionNew()
        {
            ExceptionCreatedOnDateTime = DateTime.Now;
        }

        public DateTime ExceptionCreatedOnDateTime { get; set; }
    }
}
