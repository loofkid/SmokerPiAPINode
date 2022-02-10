#!/bin/bash

apt-get update
apt-get -y install gcc g++ make libavahi-compat-libdnssd-dev libffi-dev libssl-dev python3-dev python3 python3-pip
curl -sL https://deb.nodesource.com/setup_17.x | bash -

curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | tee /usr/share/keyrings/yarnkey.gpg >/dev/null
     echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian stable main" | tee /etc/apt/sources.list.d/yarn.list
     apt-get update && apt-get install yarn

wget https://github.com/joan2937/pigpio/archive/master.zip
unzip master.zip
cd pigpio-master
make
make install

cp ./smokerpiapi.service /etc/systemd/system/