FROM gs_tools:3.3.0

WORKDIR /home/app

COPY . .

ENV C_FORCE_ROOT=1
