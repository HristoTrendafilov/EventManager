# Save the current location
$currentLocation = Get-Location

# Define the path to your project folder
$projectPath = "..\..\dev\Tools\DbToPocoGenerator"

# Define the arguments
$arguments = @(
    "Server=localhost;Port=5432;Database=ihelp;UserId=postgres;Password=peanutbutterjelly",
    "EventManager.DAL",
    "D:\dev-prod\EventManager\EventManager.DAL\Pocos.cs",
    "D:\dev-prod\EventManager\EventManager.DAL\QueryableTables.cs"
)

# Join the arguments into a single string
$argumentsString = $arguments -join " "

# Navigate to the project folder
Set-Location -Path $projectPath

# Start the project with the arguments
Start-Process -FilePath "dotnet" -ArgumentList "run -- $argumentsString" -NoNewWindow -Wait

# Return to the original location
Set-Location -Path $currentLocation