namespace EventManager.API.Services.PropertyChecker
{
    public interface IPropertyCheckerService
    {
        bool TypeHasProperties<T>(string fields);
    }
}