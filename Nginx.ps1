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