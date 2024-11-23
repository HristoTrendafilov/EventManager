namespace EventManager.API.Core
{
    public class ApiResponse<T>
    {
        public ApiResponse(T data) : this(data, null) { }

        public ApiResponse(T data, string errorMessage)
        {
            Data = data;
            ErrorMessage = errorMessage;
            ValidationPropertyErrors = new List<ValidationPropertyError>();
        }

        public T Data { get; }
        public string ErrorMessage { get; set; }
        public List<ValidationPropertyError> ValidationPropertyErrors { get; }
        public bool Success => string.IsNullOrEmpty(ErrorMessage) && !HasValidationErrors;
        public bool HasValidationErrors => ValidationPropertyErrors.Count > 0;
    }

    public class ValidationPropertyError
    {
        public string PropertyName { get; set; }
        public string ErrorMessage { get; set; }
    }
}
