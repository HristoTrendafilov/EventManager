namespace EventManager.Dto.Exception
{
    public abstract class ExceptionManipulationDto
    {
        public string Exception { get; set; }
        public string ExceptionMessage { get; set; }
        public DateTime ExceptionDateTime { get; set; }
        public bool IsResolved { get; set; }
        public long? UserId { get; set; }
    }
}
