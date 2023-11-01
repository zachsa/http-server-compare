#!/bin/bash

if [ ! -d ".venv" ]; then
    mkdir .venv
fi

pip install --user pipenv
pipenv install
exec pipenv shell