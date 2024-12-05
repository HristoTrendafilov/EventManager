namespace EventManager.API.Dto.Organization
{
    public class OrganizationNew : OrganizationBaseForm
    {
        public OrganizationNew()
        {
            OrganizationCreatedOnDateTime = DateTime.Now;
        }

        public DateTime OrganizationCreatedOnDateTime { get; set; }
        public long OrganizationCreatedByUserId { get; set; }
    }
}
