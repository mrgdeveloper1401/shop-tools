# Generated by Django 5.2.4 on 2025-07-31 15:59

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('account_app', '0001_initial'),
        ('product_app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShippingCompany',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('name', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
            ],
            options={
                'db_table': 'shipping_company',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('status', models.CharField(choices=[('pending', 'در انتظار پرداخت'), ('paid', 'پرداخت شده'), ('processing', 'در حال پردازش'), ('shipped', 'ارسال شده'), ('delivered', 'تحویل داده شده'), ('cancelled', 'لغو شده')], default='pending', max_length=20)),
                ('is_complete', models.BooleanField(default=False)),
                ('tracking_code', models.CharField(blank=True, max_length=50, null=True, unique=True)),
                ('payment_date', models.DateTimeField(blank=True, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('address', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='order_address', to='account_app.useraddress')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='orders', to='account_app.profile')),
            ],
            options={
                'db_table': 'order',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('price', models.DecimalField(decimal_places=3, max_digits=12)),
                ('quantity', models.PositiveIntegerField(default=1, validators=[django.core.validators.MinValueValidator(1)])),
                ('is_active', models.BooleanField(default=True)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='order_items', to='order_app.order')),
                ('product_variant', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='product_variant_order_items', to='product_app.productvariant')),
            ],
            options={
                'db_table': 'order_item',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='PaymentGateWay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('payment_gateway', models.JSONField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='payment_gateways', to='order_app.order')),
            ],
            options={
                'db_table': 'payment_gateway',
            },
        ),
        migrations.CreateModel(
            name='ShippingMethod',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('name', models.CharField(max_length=100, verbose_name='نام روش ارسال')),
                ('shipping_type', models.CharField(choices=[('standard', 'پست معمولی'), ('express', 'پست پیشتاز'), ('free', 'ارسال رایگان')], default='standard', max_length=20, verbose_name='نوع ارسال')),
                ('price', models.DecimalField(decimal_places=2, max_digits=10, verbose_name='هزینه ارسال')),
                ('estimated_days', models.PositiveIntegerField(verbose_name='تعداد روزهای تخمینی تحویل')),
                ('is_active', models.BooleanField(default=True, verbose_name='فعال')),
                ('company', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='methods', to='order_app.shippingcompany', verbose_name='شرکت ارسال\u200cکننده')),
            ],
            options={
                'db_table': 'shipping_method',
                'ordering': ('-id',),
            },
        ),
        migrations.AddField(
            model_name='order',
            name='shipping',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='order_shipping_methods', to='order_app.shippingmethod'),
        ),
        migrations.CreateModel(
            name='VerifyPaymentGateWay',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('deleted_at', models.DateTimeField(editable=False, null=True)),
                ('is_deleted', models.BooleanField(editable=False, null=True)),
                ('result', models.JSONField()),
                ('payment_gateway', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='result_payment_gateways', to='order_app.paymentgateway')),
            ],
            options={
                'db_table': 'result_payment_gateway',
            },
        ),
    ]
