@echo off
REM NotesVault: start backend (Flask) and frontend (static server)
REM Usage: double-click or run from cmd. This script runs servers in new windows.

setlocal
cd /d "%~dp0"

echo ==============================================
echo NotesVault - starting backend and frontend
echo Repository root: %~dp0
echo ==============================================

REM --- Backend setup ---
cd /d "%~dp0backend"
if not exist venv (
  echo Creating virtual environment in backend\venv ...
  python -m venv venv
)
echo Activating backend venv and installing requirements (if needed)...
call "%~dp0backend\venv\Scripts\activate.bat"
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Start backend in a new window (keeps running)
start "NotesVault Backend" cmd /k "cd /d "%~dp0backend" && call venv\Scripts\activate.bat && python run.py"

REM --- Frontend static server ---
cd /d "%~dp0"
echo Starting static file server for frontend at port 8000...
start "NotesVault Frontend" cmd /k "cd /d "%~dp0" && python -m http.server 8000"

echo.
echo Backend: http://127.0.0.1:5000
echo Frontend: http://127.0.0.1:8000/pages/index.html
echo Servers started in new windows. Close those windows to stop servers.
echo.
pause >nul
endlocal
