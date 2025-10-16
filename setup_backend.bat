@echo off
REM Script for install dependencies

cd backend

REM Create venv
python -m venv .venv

REM Activation venv
call .venv\Scripts\activate

REM Install PaddlePaddle
pip install --upgrade pip
pip install paddlepaddle

REM Paddlex
cd PaddleX
pip install -e ".[ocr]"

echo Installation complete!
pause
