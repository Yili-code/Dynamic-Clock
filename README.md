# GlassClock
A transparent, minimalist desktop clock that preserves your workspace aesthetics.

GlassClock is a lightweight desktop utility designed for users who value focus and wallpaper aesthetics. It provides a real-time clock overlay with a Transparent UI, ensuring your carefully curated desktop background remains the protagonist.

<img width="1700" height="860" alt="image" src="https://github.com/user-attachments/assets/86fdc52b-7ddb-4972-a9df-6c974ec9f1d3" />


## How to run
1. Terminal / Powershell
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

