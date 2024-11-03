namespace EventManager.API.Dto.CrudLog
{
    public class CrudLogFilter
    {
        public DateTime ActionDateTime { get; set; }
        public int ActionType { get; set; }
    }
}
