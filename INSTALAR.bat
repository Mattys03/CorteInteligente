@echo off
:: ============================================================
:: Corte Inteligente - Instalador Definitivo v4.0
:: Executa como Administrador para resolver permissoes
:: ============================================================
NET SESSION >nul 2>&1
if %errorLevel% neq 0 (
    echo [!] Precisamos de permissao de administrador.
    echo     Relancando como admin...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo.
echo ==============================================
echo   CORTE INTELIGENTE - Instalador Definitivo
echo ==============================================
echo.

:: PASSO 1: Registrar debug mode em TODAS as versoes CSXS
echo [1/4] Habilitando PlayerDebugMode...
for /L %%X in (6,1,17) do (
    reg add "HKEY_CURRENT_USER\Software\Adobe\CSXS.%%X" /f /v PlayerDebugMode /t REG_SZ /d 1 >nul 2>&1
)
echo       OK - Debug mode ativado (CSXS.6 ate CSXS.17)

:: PASSO 2: Limpar instalacao antiga no Program Files
echo.
echo [2/4] Limpando instalacao antiga...
set "DEST=C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\CorteInteligente"
if exist "%DEST%" (
    rd /s /q "%DEST%" 2>nul
    echo       OK - Pasta antiga removida
) else (
    echo       OK - Nada para limpar
)

:: PASSO 3: Limpar instalacao antiga no AppData
set "DEST2=%APPDATA%\Adobe\CEP\extensions\CorteInteligente"
if exist "%DEST2%" (
    rd /s /q "%DEST2%" 2>nul
    echo       OK - AppData limpo
)

:: PASSO 4: Copiar arquivos novos
echo.
echo [3/4] Copiando arquivos novos...
set "SRC=%~dp0"
mkdir "%DEST%\CSXS" 2>nul
mkdir "%DEST%\jsx" 2>nul

copy /Y "%SRC%.debug"              "%DEST%\.debug"              >nul
copy /Y "%SRC%CSInterface.js"      "%DEST%\CSInterface.js"      >nul
copy /Y "%SRC%index.html"          "%DEST%\index.html"          >nul
copy /Y "%SRC%CSXS\manifest.xml"   "%DEST%\CSXS\manifest.xml"   >nul
copy /Y "%SRC%jsx\hostscript.jsx"  "%DEST%\jsx\hostscript.jsx"  >nul

echo       OK - Arquivos copiados

:: PASSO 5: Verificar
echo.
echo [4/4] Verificando instalacao...
if exist "%DEST%\CSXS\manifest.xml" (
    if exist "%DEST%\index.html" (
        if exist "%DEST%\jsx\hostscript.jsx" (
            echo       OK - Todos os arquivos verificados!
            echo.
            echo ==============================================
            echo   INSTALACAO COMPLETA!
            echo.
            echo   Feche o Premiere Pro e abra novamente.
            echo   Va em: Janela ^> Extensoes ^> Corte Inteligente
            echo ==============================================
        ) else (
            echo       ERRO - hostscript.jsx nao encontrado!
        )
    ) else (
        echo       ERRO - index.html nao encontrado!
    )
) else (
    echo       ERRO - manifest.xml nao encontrado!
)

echo.
pause
