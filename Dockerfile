FROM gs_tools:6.0.0

WORKDIR /home/app

COPY . .

ENV C_FORCE_ROOT=1 && \
    source $HOME/.local/bin/env && \
    echo 'eval "$(uv generate-shell-completion bash)"' >> ~/.bashrc && \
    echo 'eval "$(uvx --generate-shell-completion bash)"' >> ~/.bashrc
