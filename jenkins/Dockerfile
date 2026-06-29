FROM jenkins/jenkins:lts-jdk17

USER root

RUN apt-get update && apt-get install -y curl nodejs npm && apt-get clean

#baixando o docker cli direto para evitar atrito por causa do arm do mac 
RUN curl -fsSL "https://download.docker.com/linux/static/stable/$(uname -m)/docker-24.0.9.tgz" -o docker.tgz \
    && tar -xzvf docker.tgz \
    && mv docker/docker /usr/local/bin/ \
    && chmod +x /usr/local/bin/docker \
    && rm -rf docker docker.tgz