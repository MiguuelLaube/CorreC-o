@echo off
chcp 65001 > nul
title CorrenteCão - Servidor de Desenvolvimento
echo ========================================================
echo   Iniciando o CorrenteCão...
echo ========================================================
echo.

if not exist node_modules (
    echo [INFO] Instalando dependencias do projeto...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERRO] Falha ao instalar dependencias do npm.
        pause
        exit /b %errorlevel%
    )
)

echo [INFO] Abrindo o navegador em http://localhost:3000 ...
start "" "http://localhost:3000"

echo [INFO] Iniciando o servidor Vite...
call npm run dev
pause
