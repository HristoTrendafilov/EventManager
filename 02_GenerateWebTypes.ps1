# Save the current location
$currentLocation = Get-Location

# Define the path to the project folder
$projectPath = ".\EventManager.TypescriptGenerator"

# Define the command to start the project
$startCommand = "dotnet run"

# Navigate to the project folder
Set-Location -Path $projectPath

# Execute the start command
Start-Process -FilePath "cmd.exe" -ArgumentList "/c $startCommand" -NoNewWindow -Wait

# Return to the original location
Set-Location -Path $currentLocation