FROM ubuntu:14.04

RUN apt-get clean && apt-get update
RUN apt-get install -y wget python-software-properties software-properties-common curl man vim aptitude telnet git unzip slapd tmux

RUN apt-get update
RUN apt-get install -y nodejs npm
WORKDIR /root/snap-scrip-node
RUN npm install express stripe socket.io mongodb fs body-parser winston sleep phaxio nodemailer

ADD . /root/snap-scrip-node

# install mongodb
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
RUN echo 'deb http://downloads-distro.mongodb.org/repo/ubuntu-upstart dist 10gen' | tee /etc/apt/sources.list.d/10gen.list
RUN apt-get update && apt-get install -y mongodb-org
RUN mkdir -p /data/db

# launch ssh
RUN apt-get install -y openssh-server
RUN mkdir /var/run/sshd
RUN echo 'root:welcome' |chpasswd

EXPOSE 22

# supervisor configuration
ADD docker/policy-rc.d /usr/sbin/policy-rc.d
ADD docker/sshd_config /etc/ssh/sshd_config
RUN apt-get install -y supervisor
RUN mkdir -p /var/log/supervisor
ADD docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD env | grep _ >> /etc/environment && /usr/bin/supervisord
