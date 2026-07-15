@echo off
echo ====================================
echo Changing DNS to Google DNS (8.8.8.8)
echo ====================================
echo.
echo This requires Administrator privileges.
echo Right-click this file and select "Run as administrator"
echo.
pause

netsh interface ip set dns "Wi-Fi" static 8.8.8.8 primary
netsh interface ip add dns "Wi-Fi" 8.8.4.4 index=2

echo.
echo ====================================
echo DNS Changed Successfully!
echo ====================================
echo.
echo Flushing DNS cache...
ipconfig /flushdns

echo.
echo Done! You can now connect to MongoDB.
echo.
pause
