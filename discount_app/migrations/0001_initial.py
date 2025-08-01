# Generated by Django 5.2.4 on 2025-07-31 15:59

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('product_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('code', models.CharField(max_length=255, unique=True)),
                ('maximum_use', models.PositiveIntegerField(default=1)),
                ('number_of_uses', models.PositiveIntegerField(default=1)),
                ('for_first', models.BooleanField(default=False)),
                ('valid_from', models.DateTimeField()),
                ('valid_to', models.DateTimeField()),
                ('coupon_type', models.CharField(choices=[('percent', 'Percent'), ('amount', 'Amount')], default='percent', max_length=7)),
                ('amount', models.CharField(max_length=15)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'coupon',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Discount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('object_id', models.PositiveIntegerField()),
                ('name', models.CharField(max_length=100)),
                ('discount_type', models.CharField(choices=[('percent', 'Percent'), ('amount', 'Amount')], default='percent', max_length=7)),
                ('amount', models.CharField(max_length=15)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('content_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype')),
            ],
            options={
                'db_table': 'discount_content_type',
            },
        ),
        migrations.CreateModel(
            name='ProductDiscount',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('discount_type', models.CharField(choices=[('percent', 'Percent'), ('amount', 'Amount')], default='percent', max_length=7)),
                ('amount', models.CharField(max_length=15)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('product', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='product_discounts', to='product_app.product')),
                ('product_variant', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='product_variant_discounts', to='product_app.productvariant')),
            ],
            options={
                'db_table': 'product_discount',
                'ordering': ('-id',),
            },
        ),
    ]
