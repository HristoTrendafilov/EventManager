namespace EventManager.BOL
{
    public class Mapper
    {
        public void ObjectToObject(object source, object destination)
        {
            var sourceType = source.GetType();
            var destinationType = destination.GetType();

            var sourceProperties = sourceType.GetProperties();
            var destinationProperties = destinationType.GetProperties();

            foreach (var sourceProperty in sourceProperties)
            {
                var destinationProperty = destinationProperties
                    .FirstOrDefault(x => x.Name.Equals(sourceProperty.Name, StringComparison.CurrentCultureIgnoreCase));

                if (destinationProperty != null && destinationProperty.CanWrite)
                {
                    var value = sourceProperty.GetValue(source);
                    destinationProperty.SetValue(destination, value);
                }
            }
        }

        public TDestination CreateObject<TDestination>(object source) where TDestination : class
        {
            if (source == null)
            {
                return default;
            }

            var sourceType = source.GetType();
            var destinationType = typeof(TDestination);
            var destinationObject = Activator.CreateInstance<TDestination>();

            var destinationProperties = destinationType.GetProperties();

            foreach (var destinationProperty in destinationProperties)
            {
                var sourceProperty = sourceType.GetProperty(destinationProperty.Name);

                if (sourceProperty != null && sourceProperty.PropertyType == destinationProperty.PropertyType)
                {
                    var value = sourceProperty.GetValue(source);
                    destinationProperty.SetValue(destinationObject, value);
                }
            }

            return destinationObject;
        }

        public List<TDestination> CreateList<TDestination>(IEnumerable<object> sourceList) where TDestination : class
        {
            var destinationList = new List<TDestination>();

            foreach (object sourceItem in sourceList)
            {
                var destinationItem = CreateObject<TDestination>(sourceItem);
                if (destinationItem != null)
                {
                    destinationList.Add(destinationItem);
                }
            }

            return destinationList;
        }
    }
}
