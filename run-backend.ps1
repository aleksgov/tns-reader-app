cd api
if (!(Test-Path "venv")) {
  python -m venv venv
  .\venv\Scripts\Activate
  pip install -r requirements.txt
} else {
  .\venv\Scripts\Activate
}
flask run
