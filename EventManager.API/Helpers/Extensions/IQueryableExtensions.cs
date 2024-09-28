using System.Linq.Expressions;

namespace EventManager.API.Helpers.Extensions
{
    public static class IQueryableExtensions
    {
        public static IQueryable<TDestination> MapTo<TDestination, T>(this IQueryable<T> source) where TDestination : class, new()
        {
            // Create the parameter expression, representing each object in the source
            var parameter = Expression.Parameter(source.ElementType, "x");

            // Create the body of the select expression
            var bindings = typeof(TDestination)
                .GetProperties()
                .Select(destinationProperty =>
                {
                    var sourceProperty = source.ElementType.GetProperty(destinationProperty.Name);

                    if (sourceProperty == null)
                    {
                        return null; // Skip properties that don't exist in the source
                    }

                    // Map the source property to the destination property
                    var sourcePropertyExpression = Expression.Property(parameter, sourceProperty);
                    return Expression.Bind(destinationProperty, sourcePropertyExpression);
                })
                .Where(binding => binding != null)
                .ToArray();

            // Create the expression to instantiate the destination class
            var body = Expression.MemberInit(Expression.New(typeof(TDestination)), bindings);

            // Create the final lambda expression: x => new TDestination { ... }
            var selector = Expression.Lambda(body, parameter);

            // Use the Queryable.Select method to project each source object to TDestination
            var result = Expression.Call(
                typeof(Queryable),
                "Select",
                new Type[] { source.ElementType, typeof(TDestination) },
                source.Expression,
                selector
            );

            return source.Provider.CreateQuery<TDestination>(result);
        }
    }
}
