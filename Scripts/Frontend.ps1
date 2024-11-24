# Start Visual Studio Code
Start-Process code ..\EventManager.Web\ -WindowStyle Hidden
Start-Sleep -Seconds 1

npm run dev --prefix ../EventManager.Web