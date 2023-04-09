#!/bin/bash

sudo docker-compose up --build &

sleep 20

firefox localhost:3000 &