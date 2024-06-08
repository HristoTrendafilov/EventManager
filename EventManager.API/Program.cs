using EventManager.API;

WebApplication.CreateBuilder(args)
    .ConfigureSwagger()
    .ConfigureServices()
    .RegisterServices()
    .ConfigureSerilog()
    .ConfigureErrorHandling()
    .ConfigureDataSerialization()
    .ConfigureAccess()
    .Build()
    .ConfigurePipeline()
    .Run();