FROM python:3.8-slim-buster

WORKDIR /app

COPY "requirements.txt" /app
COPY autoUpdateIP.py /app

RUN pip install --no-cache-dir -r requirements.txt || echo "No requirements.txt"

# 将宿主机的时间配置文件挂载到容器中
VOLUME /etc/localtime:/etc/localtime:ro

# 配置 github
RUN apt-get update

RUN apt-get install -y git ssh

RUN mkdir -p /root/.ssh

COPY id_rsa /root/.ssh/

RUN echo "StrictHostKeyChecking no" >> /etc/ssh/ssh_config \
    && echo "UserKnownHostsFile /dev/null" >> /etc/ssh/ssh_config

RUN git config --global user.email "535987745@qq.com" \
    && git config --global user.name "coolmoon327"

RUN git config --global --add safe.directory /app

CMD ["python", "autoUpdateIP.py"]