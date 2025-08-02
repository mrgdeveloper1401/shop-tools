import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.envs.development")
django.setup()

from product_app.models import Category
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

read_category_data_by_csv = pd.read_csv("category_data.csv")

category_list = [
    Category.add_root(
        category_name=i,
        category_slug=j
    )
    for i, j in read_category_data_by_csv.values
]
Category.objects.bulk_create(category_list)