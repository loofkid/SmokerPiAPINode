#!/bin/bash

rm -f /var/run/pigpio.pid

# rm -rf node_modules

/usr/bin/yarn install
/usr/bin/yarn run start