# Store the current directory
$currentDir = Get-Location

# Navigate to the nginx folder
cd ../nginx/

# Create the temp folder if it doesn't exist
if (-not (Test-Path ./temp)) {
  mkdir ./temp
}

# Create the logs folder if it doesn't exist
if (-not (Test-Path ./logs)) {
  mkdir ./logs
}

# Kill existing nginx processes
ps nginx | ForEach-Object { Stop-Process -Id $_.Id }

# Start nginx with the specified arguments
Start-Process -FilePath "nginx" -ArgumentList "-g `"daemon off;`""

# Return to the original directory
cd $currentDir
