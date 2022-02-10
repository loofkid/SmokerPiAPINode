FROM node:latest

RUN mkdir -p /app

WORKDIR /app

RUN set -eux; apt-get update; apt-get install -y gosu; gosu nobody true
RUN apt-get update && apt-get install avahi-daemon avahi-discover libnss-mdns libavahi-compat-libdnssd-dev make gcc g++ -y; rm -rf /var/lib/apt/lists/*;

RUN wget https://github.com/joan2937/pigpio/archive/master.zip
RUN unzip master.zip
WORKDIR /app/pigpio-master
RUN make
RUN make install

RUN groupadd -g 997 gpio && groupadd -g 998 i2c && usermod -aG i2c -aG gpio root

WORKDIR /app

COPY docker_startup.sh /docker_startup.sh
RUN chmod +x /docker_startup.sh

ENTRYPOINT [ "/docker_startup.sh" ]