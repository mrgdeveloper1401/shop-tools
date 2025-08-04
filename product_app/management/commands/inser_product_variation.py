from decimal import Decimal

from django.core.management.base import BaseCommand
import pandas as pd

from product_app.models import ProductVariant


class Command(BaseCommand):
    help = "Insert product variation data"

    def add_arguments(self, parser):
        # Define any arguments your command accepts
        # Example: Positional argument
        parser.add_argument(
            '--file',
            type=str,
            required=True,
            help='Path to the CSV file containing product data'
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
            variations = []
            for item in data.values:
                variations.append(
                    ProductVariant(
                        id=item[0],
                        product_id=item[1],
                        name=item[2],
                        price=Decimal(item[3]),
                        is_active=True
                    )
                )
            if variations:
                ProductVariant.objects.bulk_create(variations)

            self.stdout.write(self.style.SUCCESS(
                f'Successfully imported {len(variations)} products'
            ))

        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(
                f'File not found at path: {file_path}'
            ))
        except Exception as e:
            self.stdout.write(self.style.ERROR(
                f'An error occurred: {str(e)}'
            ))
