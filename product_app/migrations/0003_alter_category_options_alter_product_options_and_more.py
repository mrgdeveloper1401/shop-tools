# Generated by Django 5.2.4 on 2025-07-18 06:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product_app', '0002_alter_product_product_barcode_alter_product_sku_and_more'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'ordering': ('-id',)},
        ),
        migrations.AlterModelOptions(
            name='product',
            options={'ordering': ('-id',)},
        ),
        migrations.AlterModelOptions(
            name='productbrand',
            options={'ordering': ('-id',)},
        ),
        migrations.AlterModelOptions(
            name='productcomment',
            options={'ordering': ('-id',)},
        ),
    ]
