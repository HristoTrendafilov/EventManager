using LinqToDB;
using EventManager.BOL;
using System.Linq.Expressions;
using Newtonsoft.Json;
using LinqToDB.Mapping;
using System.Reflection;

namespace EventManager.DAL
{
    public static class Extensions
    {
        public static async Task<long> X_CreateAsync<T>
            (this IQueryable<T> table, object model, long? currentUserId) where T : class, new()
        {
            var linqToDbTable = table as ITable<T>;
             
            var poco = Mapper.CreateObject<T>(model);
            var primaryKey = await linqToDbTable.DataContext.InsertWithInt64IdentityAsync(poco);

            var crudLog = new CrudLogPoco
            {
                CrudLogPocoBeforeAction = JsonConvert.SerializeObject(new T()),
                CrudLogPocoAfterAction = JsonConvert.SerializeObject(poco),
                CrudLogTable = linqToDbTable.TableName,
                CrudLogActionType = (int)CrudActionType.Create,
                CrudLogTablePrimaryKey = primaryKey,
                CrudLogCreatedByUserId = currentUserId,
                CrudLogCreatedOnDateTime = DateTime.Now,
            };
            await linqToDbTable.DataContext.InsertWithInt64IdentityAsync(crudLog);

            return primaryKey;
        }

        public static async Task<long> X_UpdateAsync<T>
            (this IQueryable<T> table, long primaryKey, object model, long? currentUserId) where T : class, new()
        {
            var linqToDbTable = table as ITable<T>;

            var primaryKeyPropertyName = GetPrimaryKeyPropertyName<T>();
            var predicate = BuildPredicate<T>(primaryKeyPropertyName, primaryKey);
            var poco = await linqToDbTable.FirstOrDefaultAsync(predicate);

            var crudLog = new CrudLogPoco
            {
                CrudLogPocoBeforeAction = JsonConvert.SerializeObject(poco),
                CrudLogTable = linqToDbTable.TableName,
                CrudLogActionType = (int)CrudActionType.Update,
                CrudLogTablePrimaryKey = primaryKey,
                CrudLogCreatedByUserId = currentUserId,
                CrudLogCreatedOnDateTime = DateTime.Now,
            };

            Mapper.ObjectToObject(model, poco);
            crudLog.CrudLogPocoAfterAction = JsonConvert.SerializeObject(poco);

            await linqToDbTable.DataContext.UpdateAsync(poco);
            await linqToDbTable.DataContext.InsertWithInt64IdentityAsync(crudLog);

            return primaryKey;
        }

        public static async Task X_DeleteAsync<T>
            (this IQueryable<T> table, Expression<Func<T, bool>> predicate, long? currentUserId) where T : class, new()
        {
            var linqToDbTable = table as ITable<T>;

            var modelsToDelete = await linqToDbTable.Where(predicate).ToListAsync();

            if (modelsToDelete.Count != 0)
            {
                var primaryKeyPropertyName = GetPrimaryKeyPropertyName<T>();
                var primaryKeyProperty = typeof(T).GetProperty(primaryKeyPropertyName);

                var crudLogs = modelsToDelete.Select(model =>
                {
                    var primaryKeyValue = primaryKeyProperty.GetValue(model);

                    return new CrudLogPoco
                    {
                        CrudLogPocoBeforeAction = JsonConvert.SerializeObject(model),
                        CrudLogTable = linqToDbTable.TableName,
                        CrudLogActionType = (int)CrudActionType.Delete,
                        CrudLogTablePrimaryKey = Convert.ToInt64(primaryKeyValue),
                        CrudLogCreatedByUserId = currentUserId,
                        CrudLogCreatedOnDateTime = DateTime.Now,
                    };
                }).ToList();

                await linqToDbTable.Where(predicate).DeleteAsync();

                foreach (var crudLog in crudLogs)
                {
                    await linqToDbTable.DataContext.InsertWithInt64IdentityAsync(crudLog);
                }
            }
        }

        private static string GetPrimaryKeyPropertyName<T>() where T : class
        {
            var primaryKeyProperty = typeof(T).GetProperties()
                .FirstOrDefault(p => p.GetCustomAttribute<PrimaryKeyAttribute>() != null);

            return primaryKeyProperty?.Name;
        }

        private static Expression<Func<T, bool>> BuildPredicate<T>(string propertyName, long primaryKey)
        {
            var parameter = Expression.Parameter(typeof(T));
            var property = Expression.Property(parameter, propertyName);
            var constant = Expression.Constant(primaryKey);
            var predicateBody = Expression.Equal(property, constant);

            return Expression.Lambda<Func<T, bool>>(predicateBody, parameter);
        }
    }

    public enum CrudActionType
    {
        None = 0,
        Create = 1,
        Update = 2,
        Delete = 3,
    }
}
