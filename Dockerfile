FROM gs_tools:2.0.0

WORKDIR /home/app

COPY . .

ENV C_FORCE_ROOT=1
