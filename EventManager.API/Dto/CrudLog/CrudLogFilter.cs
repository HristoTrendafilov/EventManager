using EventManager.API.Helpers;

namespace EventManager.API.Dto.CrudLog
{
    [GenerateZodSchema]
    public class CrudLogFilter
    {
        public DateTime ActionDateTime { get; set; }
        public int ActionType { get; set; }
    }
}
