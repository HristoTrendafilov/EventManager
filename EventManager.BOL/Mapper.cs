using System.Reflection;

namespace EventManager.BOL
{
    public class Mapper
    {
        private static readonly Dictionary<Type, PropertyInfo[]> PropertyCache = new();

        public static void ObjectToObject(object source, object destination)
        {
            if (source == null || destination == null)
            {
                throw new ArgumentNullException(source == null ? nameof(source) : nameof(destination));
            }

            var sourceType = source.GetType();
            var destinationType = destination.GetType();

            var sourceProperties = GetCachedProperties(sourceType);
            var destinationProperties = GetCachedProperties(destinationType);

            foreach (var sourceProperty in sourceProperties)
            {
                var destinationProperty = destinationProperties
                    .FirstOrDefault(x => x.Name.Equals(sourceProperty.Name, StringComparison.CurrentCultureIgnoreCase));

                if (destinationProperty != null)
                {
                    var value = sourceProperty.GetValue(source);
                    destinationProperty.SetValue(destination, value);
                }
            }
        }

        public static TDestination CreateObject<TDestination>(object source) where TDestination : class, new()
        {
            if (source == null)
            {
                return default;
            }

            var destinationObject = new TDestination();
            ObjectToObject(source, destinationObject);
            return destinationObject;
        }

        public static List<TDestination> CreateList<TDestination>(IEnumerable<object> sourceList) where TDestination : class, new()
        {
            var destinationList = new List<TDestination>();

            foreach (var sourceItem in sourceList)
            {
                var destinationItem = CreateObject<TDestination>(sourceItem);
                if (destinationItem != null)
                {
                    destinationList.Add(destinationItem);
                }
            }

            return destinationList;
        }

        private static PropertyInfo[] GetCachedProperties(Type type)
        {
            if (!PropertyCache.TryGetValue(type, out var properties))
            {
                properties = type.GetProperties(BindingFlags.Public | BindingFlags.Instance);
                PropertyCache[type] = properties;
            }

            return properties;
        }
    }
}
