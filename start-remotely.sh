#!/bin/bash

rsync -aP --exclude=".yarn/" --exclude=".yarnrc.yml" $(pwd)/ pi@10.8.13.45:/home/pi/Documents/source/repos/SmokerPiAPINode

ssh pi@10.8.13.45 "cd /home/pi/Documents/source/repos/SmokerPiAPINode && yarn && yarn run start"