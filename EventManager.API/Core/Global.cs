﻿using System.Reflection;

namespace EventManager.API.Core
{
    public static class Global
    {
        public static string BinFolder = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        public static string ProjectFolder = Path.GetFullPath(Path.Combine(BinFolder, @"..\..\.."));

        public static string EmailTemplatesFolder = Path.Combine(BinFolder, "Services", "Email", "Templates");
        public static string EmailVerificationTemplate = Path.Combine(EmailTemplatesFolder, "EmailVerificationTemplate.html");
    }
}
