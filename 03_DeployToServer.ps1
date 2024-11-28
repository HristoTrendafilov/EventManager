Write-Host "BUILDING FRONTEND!" -ForegroundColor Magenta 

cd .\EventManager.Web

npm run build
cd .\dist

Write-Host "UPLOADING THE NEW FILES TO SERVER!" -ForegroundColor Green 
scp -r -p .\* root@164.138.216.170:/home/ihelp/client

cd ..\..

Write-Host "BUILDING BACKEND!" -ForegroundColor Magenta 

cd .\EventManager.API

dotnet build -v q

Write-Host "PUBLISHING THE PROJECT!" -ForegroundColor Green 
dotnet publish .\EventManager.API.csproj -v q -r linux-x64 --self-contained false -c release -o ./bin/publish

Write-Host "STOPPING THE SERVICE!" -ForegroundColor Green 
ssh root@164.138.216.170 systemctl stop ihelp.service

Write-Host "UPLOADING THE NEW FILES TO SERVER!" -ForegroundColor Green 
cd .\bin\publish
scp -r -p .\* root@164.138.216.170:/home/ihelp/server

ssh root@164.138.216.170 chmod 777 /home/ihelp/server/EventManager.API

Write-Host "RESTARTING THE SERVICE!" -ForegroundColor Green 
ssh root@164.138.216.170 systemctl restart ihelp.service

cd ..\..\..