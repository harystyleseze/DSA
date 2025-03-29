cd secret-backend

conda create -n menv python=3.12

conda activate menv

pip install -r requirements.txt && pip install 'secret-sdk>=1.8.1' && pip install secret-ai-sdk

export SECRET_AI_API_KEY=bWFzdGVyQHNjcnRsYWJzLmNvbTpTZWNyZXROZXR3b3JrTWFzdGVyS2V5X18yMDI1

For macOS/Linux:

bash
Copy
export FLASK_APP=chat.py
For Windows (Command Prompt):

bash
Copy
set FLASK_APP=chat.py
For Windows (PowerShell):

bash
Copy
$env:FLASK_APP = "chat.py"

python secret_ai_getting_started.py

pip install -r requirements.txt
python -m flask run --port=5000

pip install secret-ai-sdk

python3 -m venv menv # recreate with the updated Python version
source menv/bin/activate # activate the new environment
deactivate # to exit the current virtual environment
rm -rf menv # remove the old virtual environment
