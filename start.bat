:: Important stuff
@echo off && cls
title GoAnimate-2014-Remastered
if not exist "installed" (if not exist "notinstalled" (echo GoAnimate-2014-Remastered
 Configuration File >> notinstalled))
::::::::::::::::::::
:: Initialization ::
::::::::::::::::::::

:: Terminate existing node.js apps
TASKKILL /IM node.exe /F 2>nul
cls

:::::::::::::::::::::::::::::
:: Start GoAnimate-2014-Remastered
 ::
:::::::::::::::::::::::::::::

:: Check for installation
if exist notinstalled (
	echo GoAnimate-2014-Remastered
 is not installed! Installing...
	call npm install
	ren "notinstalled" "installed"
	cls
	goto start
) else (
	goto start
)

:: Run npm start
:start
echo GoAnimate-2014-Remastered
 is now starting...
echo Please navigate to http://localhost on your browser.
npm start
