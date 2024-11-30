using System.Reflection;

namespace EventManager.API.Core
{
    public static class Global
    {
        public static string BinFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        public static string EmailTemplatesFolder = Path.Combine(BinFolder, "Services", "Email", "Templates");

        public static DateTime SystemMinDateTime = new DateTime(1900, 1, 1);
        public static DateTime SystemMaxDateTime = new DateTime(3000, 1, 1);
    }
}
