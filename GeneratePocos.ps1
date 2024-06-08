# Define the path to your C# console application executable
$exePath = "D:\dev\Tools\DbToPocoGenerator\bin\Debug\net8.0\DbToPocoGenerator.exe"

$arguments = @(
    "Server=localhost;Port=5432;Database=event_manager;UserId=postgres;Password=peanutbutterjelly",
    "EventManager.DAL",
    "D:\\dev-prod\\EventManager\\EventManager.DAL\\Pocos.cs",
    "D:\\dev-prod\\EventManager\\EventManager.DAL\\QueryableTables.cs"
)


$argumentsString = $arguments -join " "

# Start the process with the executable path and arguments
Start-Process -FilePath $exePath -ArgumentList $argumentsString -NoNewWindow -Wait