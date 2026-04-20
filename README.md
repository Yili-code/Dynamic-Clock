# Just a clock

## How to run
1. 
``` 
cd "Your Project Path"

npm install 

npm start
``` 

2. create a bat file named "run.bat" in the same directory as the project.
then add the following content:
```bat
@echo off

powershell -WindowStyle Hidden -Command "Set-Location 'Your Project Path'; npm start"
```
replace 'Your Project Path' with the actual path to your project.

