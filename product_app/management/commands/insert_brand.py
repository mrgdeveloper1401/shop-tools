from django.core.management.base import BaseCommand
import pandas as pd
from django.utils import timezone

from product_app.models import ProductBrand


class Command(BaseCommand):
    help = "Insert brand data"

    def add_arguments(self, parser):
        # Define any arguments your command accepts
        # Example: Positional argument
        parser.add_argument(
            '--file',
            type=str,
            required=True,
            help='Path to the CSV file containing brand data'
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

            # ایجاد لیست برندها
            brands = []
            for item in data.values:
                brands.append(
                    ProductBrand(
                        id=item[0],
                        brand_name=item[1],
                        created_at=timezone.now(),
                        updated_at=timezone.now()
                    )
                )
            if brands:
                ProductBrand.objects.bulk_create(brands)

            self.stdout.write(self.style.SUCCESS(
                f'Successfully imported {len(brands)} brands'
            ))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(
                f'File not found at path: {file_path}'
            ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'An error occurred: {str(e)}'
            ))
