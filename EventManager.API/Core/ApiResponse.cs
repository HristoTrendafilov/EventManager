namespace EventManager.API.Core
{
    public class ApiResponse<T>
    {
        public ApiResponse(T data, string errorMessage = null)
        {
            Data = data;
            ErrorMessage = errorMessage;
            ValidationPropertyErrors = new List<ValidationPropertyError>();
        }

        public T Data { get; set; }
        public string ErrorMessage { get; set; }
        public List<ValidationPropertyError> ValidationPropertyErrors { get; set; }
        public bool Success => ErrorMessage == null && ValidationPropertyErrors.Count == 0;
        public bool HasValidationErrors => ValidationPropertyErrors.Count > 0;
    }

    public class ValidationPropertyError
    {
        public string PropertyName { get; set; }
        public string ErrorMessage { get; set; }
    }
}
