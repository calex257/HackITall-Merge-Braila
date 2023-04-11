#!/bin/bash

sudo docker-compose up --build &

sleep 20

python3 -m webbrowser localhost:3000 &

wait -f 