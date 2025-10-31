from django.core.management.base import BaseCommand, CommandError
from account_app.models import State
import pandas as pd
from pathlib import Path

base_dir = Path(__file__).parent.parent.parent.parent


class Command(BaseCommand):
    help = "insert data state and city"

    def add_arguments(self, parser):
        parser.add_argument('--file', help="location csv file")

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

            if lst:
                State.objects.bulk_create(lst)
                self.stdout.write(self.style.SUCCESS(f"Successfully created {len(lst)} states"))

        except FileNotFoundError as e:
            raise CommandError(f"File not found: {e}")
        except Exception as e:
            raise CommandError(f"An error occurred: {e}")
