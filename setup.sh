DIRECTORY="venv"
if [ ! -d "$DIRECTORY" ]; then
  echo "setting up virtual environment"
  python3 -m venv venv

  echo "activating virtual environment"
  . venv/bin/activate

  echo "virtual environment created successfully"

  echo "install flask"
  pip install Flask

  echo "--- Flask Installed Successfully ---"

  echo "setting up few environment variables"
  export FLASK_APP=application
  export FLASK_ENV=development

else
  echo "activating virtual environment"
  . venv/bin/activate

  echo "virtual environment activated successfully"

  echo "setting up few environment variables"
  export FLASK_APP=application
  export FLASK_ENV=development

fi
