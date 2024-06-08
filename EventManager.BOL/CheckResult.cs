namespace EventManager.BOL
{
    public class CheckResult
    {
        private readonly List<string> Errors;

        public CheckResult()
        {
            Errors = new List<string>();
        }

        public static CheckResult Default => new CheckResult();

        public bool IsFailed => Errors.Count > 0;

        public bool Success => Errors.Count == 0;

        public void AddError(string errorMessage)
        {
            Errors.Add(errorMessage);
        }

        public string GetErrors(string separator = "\n")
        {
            return string.Join(separator, Errors);
        }

        public static CheckResult FromErrorMessage(string message)
        {
            var check = new CheckResult();
            check.AddError(message);

            return check;
        }
    }
}
