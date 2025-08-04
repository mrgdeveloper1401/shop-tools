from django.core.management.base import BaseCommand
import pandas as pd
from django.utils import timezone
from django.views.generic.dates import timezone_today

from product_app.models import Category


class Command(BaseCommand):
    help = 'read data from csv file and insert into db'

    def add_arguments(self, parser):
        # Define any arguments your command accepts
        # Example: Positional argument
        parser.add_argument(
            '--file',
            type=str,
            required=True,
            help='Path to the CSV file containing category data'
        )

        # Example: Optional argument
        parser.add_argument(
            '--delimiter',
            default=',',
            type=str,
            help='CSV delimiter (default: comma)'
        )

    def handle(self, *args, **options):
        # This method contains the core logic of your command.
        # Access arguments using the 'options' dictionary.
        file_path = options['file']
        delimiter = options['delimiter']

        try:
            # خواندن فایل CSV
            data = pd.read_csv(file_path, delimiter=delimiter)

            # ایجاد لیست دسته‌بندی‌ها
            categories = []
            for item in data.values:
                categories.append(
                    Category.add_root(
                        id=item[0],
                        category_name=item[1],
                        category_slug=item[2],
                        created_at=timezone.now(),
                        updated_at=timezone.now()
                    )
                )

            self.stdout.write(self.style.SUCCESS(
                f'Successfully imported {len(categories)} categories'
            ))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(
                f'File not found at path: {file_path}'
            ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'An error occurred: {str(e)}'
            ))
