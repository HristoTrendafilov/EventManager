using EventManager.API.Dto.Event;
using EventManager.API.Helpers;
using EventManager.DAL;

namespace EventManager.API.Dto.Organization
{
    [GenerateTypeScriptInterface]
    public class OrganizationView : VOrganizationPoco
    {
        public OrganizationView()
        {
            Events = new List<EventView>();
        }

        public string OrganizationLogoUrl { get; set; }
        public bool IsUserSubscribed { get; set; }
        public bool CanEdit { get; set; }
        public List<EventView> Events { get; set; }
    }
}
