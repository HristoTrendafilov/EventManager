namespace EventManager.DAL
{
    public partial class PostgresConnection
    {
        public async Task<long> WithTransactionAsync(Func<Task<long>> action)
        {
            try
            {
                await BeginTransactionAsync();
                var primaryKey = await action?.Invoke();
                await CommitTransactionAsync();

                return primaryKey;
            }
            catch (Exception ex)
            {
                await RollbackTransactionAsync();
                throw new InvalidOperationException("Database error", ex);
            }
        }

        public async Task WithTransactionAsync(Func<Task> action)
        {
            try
            {
                await BeginTransactionAsync();
                await action?.Invoke();
                await CommitTransactionAsync();
            }
            catch (Exception ex)
            {
                await RollbackTransactionAsync();
                throw new InvalidOperationException("Database error", ex);
            }
        }
    }
}
