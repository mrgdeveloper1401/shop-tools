FROM gs_tools:7.0.0

WORKDIR /home/app

# کپی فایل‌های config
COPY pyproject.toml uv.lock ./

# نصب dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# کپی کد پروژه
COPY . .

# نصب پروژه
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-dev

ENV PATH="/app/.venv/bin:$PATH"
