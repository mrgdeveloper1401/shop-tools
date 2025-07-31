import csv
from pathlib import Path
import os
import django


script_dir = Path(__file__).parent
# print(script_dir)

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.envs.development")
django.setup()

from account_app.models import User, Profile
from django.db import connection

wp_users_csv = script_dir.joinpath('wp_users.csv')
# print(wp_users_csv)
# print(wp_users_csv.exists()) # return true ot false
# print(wp_users_csv.resolve()) # return route file

with open(wp_users_csv, "r") as csvfile:
    for row in csv.DictReader(csvfile):
        user, created = User.objects.get_or_create(
            # created_at=row["user_registered"],
            password=row["user_pass"],
            email=row["user_email"],
            username=row["user_login"],
            is_active=True
        )
        # print(user)
        profile = Profile.objects.filter(user=user)
        profile.update(
            full_name=row["user_nicename"],
            display_name=row['display_name']
        )
        # break
    print(len(connection.queries))