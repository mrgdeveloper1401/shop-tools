import os
import django
from pathlib import Path
import sys


BASE_DIR = Path(__file__).resolve().parent.parent.parent
# print(BASE_DIR)

sys.path.append(str(BASE_DIR))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.envs.development")
django.setup()

from product_app.models import Category
import pandas as pd


read_category_data_by_csv = pd.read_csv("category_data.csv")
# print(read_category_data_by_csv)

# category_list = [
#     Category.add_root(
#         category_name=i,
#         category_slug=j
#     )
#     for i, j in read_category_data_by_csv.values
# ]
# Category.objects.bulk_create(category_list)

category_list = [
    Category.add_root(
        category_name=j,
        category_slug=z,
        id=i
    )
    for i, j, z in read_category_data_by_csv.values
]
Category.objects.bulk_create(category_list)
