@echo off
:: Asegurar que estamos en el directorio del script
cd /d "%~dp0"
title Lanzador Farmanet

echo ===================================================
echo    FARMANET - GESTION MEDICA (INICIANDO...)
echo ===================================================
echo.

:: Iniciar Backend
echo [+] Lanzando Backend...
start "Farmanet-Backend" cmd /k "cd /d "%~dp0backend" && npm run start"

:: Iniciar Frontend
echo [+] Lanzando Frontend...
start "Farmanet-Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo [+] Esperando 5 segundos para que los servidores arranquen...
timeout /t 5 /nobreak > nul

echo [+] Abriendo el navegador en http://localhost:5173...
start http://localhost:5173

echo.
echo ---------------------------------------------------
echo ¡Listo! El programa deberia abrirse en tu navegador.
echo.
echo Si el navegador no abre, ve a: http://localhost:5173
echo ---------------------------------------------------
echo.
pause
