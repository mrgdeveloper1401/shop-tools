# Generated by Django 5.2.4 on 2025-07-18 06:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('blog_app', '0003_alter_categoryblog_table'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='postblog',
            options={'ordering': ('-id',)},
        ),
        migrations.AlterModelOptions(
            name='tagblog',
            options={'ordering': ('-id',)},
        ),
    ]
