# Start Visual Studio
Start-Process devenv ..\EventManager.sln -NoNewWindow 

Start-Process dotnet -ArgumentList "run --project ../EventManager.API/EventManager.API.csproj --launch-profile `"Development https`""