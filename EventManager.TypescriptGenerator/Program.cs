using EventManager.API.Core;
using EventManager.API.Helpers;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Reflection;
using System.Text;

// Get all classes in the current assembly that have the GenerateTsInterface or GenerateZodSchema attribute
var classes = Assembly.GetAssembly(typeof(Global))?.GetTypes()  // Use any class from the referenced assembly
 .Where(t => t.IsClass).ToList();

var interfaceClasses = classes.Where(x => x.GetCustomAttributes(typeof(GenerateTypeScriptInterfaceAttribute), false).Any());
var zodSchemaClasses = classes.Where(x => x.GetCustomAttributes(typeof(GenerateZodSchemaAttribute), false).Any());

var fileBuilder = new StringBuilder();
fileBuilder.AppendLine("// eslint-disable-next-line eslint-comments/disable-enable-pair");
fileBuilder.AppendLine("/* eslint-disable no-use-before-define */");
fileBuilder.AppendLine();

fileBuilder.AppendLine("import { z } from 'zod';");
fileBuilder.AppendLine();

fileBuilder.AppendLine("// interfaces");
foreach (var interfaceClass in interfaceClasses)
{
    var tsInterface = GenerateTypeScriptInterface(interfaceClass);
    fileBuilder.AppendLine(tsInterface);
}

fileBuilder.AppendLine("// zod schemas");
foreach (var zodSchemaClass in zodSchemaClasses)
{
    var zodSchema = GenerateZodSchema(zodSchemaClass);
    fileBuilder.AppendLine(zodSchema);
}

await File.WriteAllTextAsync("../../../../EventManager.Web/src/Infrastructure/api-types.ts", fileBuilder.ToString());

// Generate TypeScript interface for the entire class
string GenerateTypeScriptInterface(Type classType)
{
    var interfaceName = classType.Name;
    var properties = classType.GetProperties()
        .Where(x => !x.GetCustomAttributes(typeof(JsonIgnoreAttribute), false).Any());

    var sb = new StringBuilder();
    sb.AppendLine($"export interface {interfaceName} {{");

    foreach (var property in properties)
    {
        var propertyName = property.Name;
        var propertyType = property.PropertyType;

        // Convert property name to camelCase
        var tsPropertyName = ToCamelCase(propertyName);

        // Handle nullable types
        var tsPropertyType = ConvertToTypeScriptType(propertyType);

        sb.AppendLine($"  {tsPropertyName}: {tsPropertyType};");
    }

    sb.AppendLine("}");

    return sb.ToString();
}

// Helper method to convert property names to camelCase
string ToCamelCase(string propertyName)
{
    if (string.IsNullOrEmpty(propertyName))
        return propertyName;

    // Convert first letter to lowercase, keep the rest as it is
    return char.ToLowerInvariant(propertyName[0]) + propertyName.Substring(1);
}

// Helper method to map C# types to TypeScript types
string ConvertToTypeScriptType(Type propertyType)
{
    // Check if the type is nullable (i.e., Nullable<T>)
    if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
    {
        // Get the underlying type (e.g., bool from bool?)
        var underlyingType = propertyType.GetGenericArguments()[0];

        // For other nullable types, map them to their TypeScript equivalent with | null
        return $"{ConvertToTypeScriptType(underlyingType)} | null";
    }

    // Check if the type is a generic collection (e.g., List<T> or ICollection<T>)
    if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(List<>))
    {
        var elementType = propertyType.GetGenericArguments()[0];
        return $"{ConvertToTypeScriptType(elementType)}[]"; // Array in TypeScript
    }

    // Map common C# types to TypeScript types
    return propertyType.Name.ToLower() switch
    {
        "string" => "string",
        "int32" => "number",
        "boolean" => "boolean",  // Map C# bool to TypeScript boolean
        "decimal" => "number",
        "int64" => "number",
        "datetime" => "Date",  // C# DateTime becomes TypeScript Date
        "iformfile" => "File | null | undefined",
        _ => GetTypeScriptTypeForComplexTypes(propertyType)  // Handle complex types
    };
}

// Handle complex or custom types (e.g., UserEventView)
string GetTypeScriptTypeForComplexTypes(Type propertyType)
{
    // Check if the property is a complex type (like UserEventView)
    if (propertyType.IsClass && propertyType != typeof(string))
    {
        // Recursively generate TypeScript for this complex type
        return propertyType.Name; // Just use the class name, TypeScript will handle it
    }

    return "unknown";
}

// Generate Zod schema for the entire class
string GenerateZodSchema(Type classType)
{
    var className = classType.Name;
    var properties = classType.GetProperties()
              .Where(x => !x.GetCustomAttributes(typeof(JsonIgnoreAttribute), false).Any());

    var req = classType.GetProperties()
        .Where(x => x.GetCustomAttributes(typeof(ValidationAttribute), false).Any())
        .ToList();

    var sb = new StringBuilder();
    sb.AppendLine($"export const {className}Schema = z.object({{");

    foreach (var property in properties)
    {
        var isNullable = !classType.GetProperty(property.Name).GetCustomAttributes<ValidationAttribute>().Any();
        var propertyType = property.PropertyType;
        sb.AppendLine($"  {ToCamelCase(property.Name)}: z.{ConvertToZodType(propertyType, isNullable)},");
    }

    sb.AppendLine("});");

    sb.AppendLine($"export type {className}Type = z.infer<typeof {className}Schema>;");

    return sb.ToString();
}

// Helper function to map C# types to Zod types
string ConvertToZodType(Type propertyType, bool isNullable)
{
    // Check if the type is nullable (i.e., Nullable<T>)
    if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(Nullable<>))
    {
        // Get the underlying type (e.g., bool from bool?)
        var underlyingType = propertyType.GetGenericArguments()[0];

        // For other nullable types, map them to their TypeScript equivalent with | null
        return $"{ConvertToZodType(underlyingType, true)}";
    }

    // Check if the type is a generic collection (e.g., List<T> or ICollection<T>)
    if (propertyType.IsGenericType && propertyType.GetGenericTypeDefinition() == typeof(List<>))
    {
        var elementType = propertyType.GetGenericArguments()[0];
        return $"{ConvertToZodType(elementType, isNullable)}.array()"; // Array in TypeScript
    }

    var schemaProperty = propertyType.Name.ToLower() switch
    {
        "string" => "string()",
        "int32" => "number()",
        "boolean" => "boolean()",
        "int64" => "number()",
        "decimal" => "number()",
        "datetime" => "coerce.date()",
        "iformfile" => "instanceof(File)",
        _ => "unknown"
    };

    if (isNullable)
    {
        schemaProperty += ".nullable()";
    }

    return schemaProperty;
}