# Generated by Django 4.0.6 on 2024-01-19 05:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='asset',
            name='asset_resources',
        ),
        migrations.RemoveField(
            model_name='asset',
            name='model',
        ),
        migrations.AlterField(
            model_name='asset',
            name='description',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]