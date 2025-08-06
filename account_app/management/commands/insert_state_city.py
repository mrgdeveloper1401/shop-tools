from django.core.management.base import BaseCommand, CommandError

from account_app.models import State, City
import pandas as pd
from pathlib import Path


base_dir = Path(__file__).parent.parent.parent.parent


class Command(BaseCommand):
    help = "insert data state and city"

    def add_arguments(self, parser):
        parser.add_argument('--file', help="location csv file")

    # option {'verbosity': 1, 'settings': None, 'pythonpath': None, 'traceback': False, 'no_color': False, 'force_color': False, 'skip_checks': False, 'file': 'test'}
    def handle(self, *args, **options):
        file = options['file']

        lst = []

        try:
            state_data = pd.read_csv(base_dir.joinpath(file))

            for i in state_data.values:
                lst.append(
                    State(
                        state_name=i[1]
                    )
                )
        except FileNotFoundError as e:
            raise CommandError(e)
        else:
            print(lst)
