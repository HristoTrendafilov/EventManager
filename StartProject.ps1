# Start Visual Studio Code
Start-Process code .\EventManager.Web\ -WindowStyle Hidden
Start-Sleep -Seconds 1

# Start Visual Studio
Start-Process devenv .\EventManager.sln -NoNewWindow 

# Start nginx
cd ./nginx/

if (-not (test-path ./temp)) {
  mkdir ./temp
}

if (-not (test-path ./logs)) {
  mkdir ./logs
}
ps nginx | kill

Start-Process -FilePath "nginx" -ArgumentList "-g `"daemon off;`""
cd ..


# Start the backend
Start-Process dotnet -ArgumentList "run --project ./EventManager.API/EventManager.API.csproj --launch-profile `"Development https`""

# Start the frontend
npm start --prefix ./EventManager.Web

