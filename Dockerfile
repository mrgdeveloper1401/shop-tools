FROM gs_tools:7.1.0

WORKDIR /home/app

# کپی کد پروژه
COPY . .

# نصب dependencies
# RUN --mount=type=cache,target=/root/.cache/uv \
#     uv sync --frozen --no-install-project --no-dev

# نصب پروژه
# RUN --mount=type=cache,target=/root/.cache/uv \
#     uv sync --frozen --no-dev

# ENV PATH="/home/app/.venv/bin:$PATH"
