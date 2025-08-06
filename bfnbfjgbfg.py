import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.envs.development")
django.setup()


from account_app.models import City, State

import pandas as pd
from pathlib import Path
from django.db import connection


base_dir = Path(__file__).parent
print(base_dir)

state_data = pd.read_csv(base_dir.joinpath("csv_data/provinces.csv"))
city_data = pd.read_csv(base_dir.joinpath("csv_data/cities.csv"))


for i in state_data.values:
    state, created = State.objects.get_or_create(
        id=i[0],
        name=i[1],
        slug=i[2],
        tel_prefix=i[3],
    )

# city_list = []

# counter = 0

for i in city_data.values:
    get_state = State.objects.get(id=i[3])

    if get_state.id == i[3]:
        print(get_state, i[3])
    #     print(i[1])
        City.objects.create(name=i[1], state_id=get_state.id)
    # counter += 1
    #
    # if counter == 100:
    #     break


# for i in city_data.values:
#     if i[3] == 100:
#         print(i)

