namespace EventManager.API.Dto.Region
{
    public class RegionNew : RegionBaseForm
    {
        public RegionNew()
        {
            RegionCreatedOnDateTime = DateTime.Now;
        }

        public DateTime RegionCreatedOnDateTime { get; set; }
    }
}
