using Serilog.Events;
using Serilog;
using Serilog.Formatting.Json;
using EventManager.API.Core;
using EventManager.API.Services.User;
using EventManager.BOL;
using LinqToDB.AspNet;
using EventManager.DAL;
using LinqToDB;
using LinqToDB.AspNet.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using EventManager.API.Services.PropertyChecker;
using EventManager.API.Services.Email;
using System.Reflection;
using Microsoft.OpenApi.Models;
using EventManager.API.Core.Exceptions;
using EventManager.API.Services.Exception;
using System.Text;
using EventManager.API.Services.Event;
using EventManager.API.Services.Log;
using EventManager.API.Services.CrudLog;
using EventManager.API.Services.WebSession;
using EventManager.API.Services.Region;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using EventManager.API.Services.Shared;

namespace EventManager.API
{
    public static class StartUpHelper
    {
        public static IConfiguration _configuration;

        public static WebApplicationBuilder ConfigureServices(this WebApplicationBuilder builder)
        {
            _configuration = builder.Configuration;

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddProblemDetails();

            builder.Services.AddLinqToDBContext<PostgresConnection>((provider, options)
                 => options.UsePostgreSQL(builder.Configuration["Postgres:ConnectionString"])
                           .UseDefaultLogging(provider));

            return builder;
        }

        public static WebApplicationBuilder ConfigureSwagger(this WebApplicationBuilder builder)
        {
            builder.Services.AddSwaggerGen(options =>
            {
                var xmlPath = Path.Combine(AppContext.BaseDirectory, $"{Assembly.GetExecutingAssembly().GetName().Name}.xml");
                options.IncludeXmlComments(xmlPath);

                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer",
                });

                options.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        new string[]{ }
                    }
                });
            });

            return builder;
        }

        public static WebApplicationBuilder RegisterServices(this WebApplicationBuilder builder)
        {
            var services = builder.Services;

            services.AddSingleton<Mapper>();
            services.AddTransient<IPropertyCheckerService, PropertyCheckerService>();
            services.AddTransient<IEmailService, EmailService>();

            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IEventService, EventService>();
            services.AddScoped<IRegionService, RegionService>();
            services.AddScoped<IExceptionService, ExceptionService>();
            services.AddScoped<ICrudLogService, CrudLogService>();
            services.AddScoped<IWebSessionService, WebSessionService>();
            services.AddScoped<ISharedService, SharedService>();

            return builder;
        }

        public static WebApplicationBuilder ConfigureSerilog(this WebApplicationBuilder builder)
        {
            Enum.TryParse(builder.Configuration["SerilogSettings:LogLevel"], out LogEventLevel minimumLevel);
            var serilogConfig = new LoggerConfiguration()
                .MinimumLevel.Is(minimumLevel)
                .WriteTo.Console()
                .WriteTo.Logger(lc =>
                {
                    lc.WriteTo.File(
                        Path.Combine(Global.ProjectFolder, builder.Configuration["SerilogSettings:LogsDirectory"]),
                        rollingInterval: RollingInterval.Day);
                })
                .WriteTo.Logger(lc =>
                {
                    lc.Filter.ByIncludingOnly(logEvent => logEvent.Exception != null).WriteTo.File(
                        new JsonFormatter(),
                        Path.Combine(Global.ProjectFolder, builder.Configuration["SerilogSettings:JsonLogsDirectory"]),
                        rollingInterval: RollingInterval.Day);
                });

            Log.Logger = serilogConfig.Enrich.FromLogContext().CreateLogger();
            builder.Logging.ClearProviders();
            builder.Host.UseSerilog();

            return builder;
        }

        public static WebApplicationBuilder ConfigureErrorHandling(this WebApplicationBuilder builder)
        {
            builder.Services.AddControllers(options =>
            {
                options.Filters.Add<ExceptionFilter>();
            });

            builder.Services.AddControllers()
                .ConfigureApiBehaviorOptions(setupAction =>
                {
                    setupAction.InvalidModelStateResponseFactory = context =>
                    {
                        var problemDetailsFactory = context.HttpContext.RequestServices
                            .GetRequiredService<ProblemDetailsFactory>();

                        var validationProblemDetails = problemDetailsFactory
                            .CreateValidationProblemDetails(context.HttpContext, context.ModelState);

                        validationProblemDetails.Detail = "See the errors field for details.";
                        validationProblemDetails.Instance = context.HttpContext.Request.Path;
                        validationProblemDetails.Status = StatusCodes.Status422UnprocessableEntity;
                        validationProblemDetails.Title = "One or more validation errors occurred.";

                        var clientMessageSb = new StringBuilder();
                        foreach (var errors in validationProblemDetails.Errors.Values)
                        {
                            clientMessageSb.AppendLine(string.Join(Environment.NewLine, errors));
                        }

                        return new UnprocessableEntityObjectResult(clientMessageSb.ToString())
                        {
                            ContentTypes = { "application/problem+json" }
                        };

                        //return new UnprocessableEntityObjectResult(validationProblemDetails)
                        //{
                        //    ContentTypes = { "application/problem+json" }
                        //};
                    };
                });

            return builder;
        }

        public static WebApplicationBuilder ConfigureDataSerialization(this WebApplicationBuilder builder)
        {
            builder.Services.AddControllers(options =>
            {
                options.ReturnHttpNotAcceptable = true;
            })
            .AddNewtonsoftJson()
            .AddXmlDataContractSerializerFormatters();

            return builder;
        }

        public static WebApplicationBuilder ConfigureAccess(this WebApplicationBuilder builder)
        {
            builder.Services.AddAuthentication("Bearer")
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new()
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        ValidIssuer = builder.Configuration["Authentication:Issuer"],
                        ValidAudience = builder.Configuration["Authentication:Audience"],
                        IssuerSigningKey = new SymmetricSecurityKey(
                           Convert.FromBase64String(builder.Configuration["Authentication:SecretForKey"] ?? "")),
                        // ClockSkew is the leeway for the expiration validation (default is 5 minutes)
                        ClockSkew = TimeSpan.Zero // Set to zero to avoid any extra time after token expiration
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            if (context.Exception is SecurityTokenExpiredException)
                            {
                                context.Response.OnStarting(() =>
                                {
                                    context.Response.Headers.Append("TokenExpired", "true");
                                    return Task.CompletedTask;
                                });
                            }

                            return Task.CompletedTask;
                        }
                    };

                });

            return builder;
        }

        public static WebApplication ConfigurePipeline(this WebApplication app)
        {
            app.UseForwardedHeaders();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
                app.UseExceptionHandler("/api/errors/development");
            }
            else
            {
                app.UseMiddleware<CustomExceptionMiddleware>();
            }

            app.UseHttpsRedirection();
            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            return app;
        }
    }
}
