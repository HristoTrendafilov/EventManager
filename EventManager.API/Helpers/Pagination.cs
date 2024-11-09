using LinqToDB;

namespace EventManager.API.Helpers
{
    public class PagedList<T> : List<T>
    {
        public int CurrentPage { get; private set; }
        public int TotalPages { get; private set; }
        public int PageSize { get; private set; }
        public int TotalCount { get; private set; }
        public bool HasPrevious => CurrentPage > 1;
        public bool HasNext => CurrentPage < TotalPages;

        public PagedList(List<T> items, int count, int pageNumber, int pageSize)
        {
            TotalCount = count;
            PageSize = pageSize;
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);
            AddRange(items);
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)
        {
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(items, source.Count(), pageNumber, pageSize);
        }
    }

    [GenerateTypeScriptInterface]
    public class PaginationMetadata
    {
        public PaginationMetadata(int totalItemCount, int pageSize, int currentPage, int totalPages)
        {
            this.TotalCount = totalItemCount;
            this.PageSize = pageSize;
            this.CurrentPage = currentPage;
            this.TotalPages = totalPages;
        }

        public PaginationMetadata()
        {
        }

        public int TotalCount { get; set; }
        public int PageSize { get; set; }
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
    }
}
