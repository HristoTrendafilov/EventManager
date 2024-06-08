namespace EventManager.DTO.Event.Image
{
    public class ImageUpdate : ImageManipulationDto
    {
        public long ImageId { get; set; }
        public bool IsNew { get; set; }
        public bool Delete { get; set; }
    }
}
