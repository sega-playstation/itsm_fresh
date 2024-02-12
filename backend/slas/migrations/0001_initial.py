# Generated by Django 4.0.6 on 2023-11-24 19:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import slas.models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', '0001_initial'),
        ('priority', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SLA_status',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status_id', models.IntegerField(default=slas.models.SLA_status.ids, unique=True)),
                ('status_name', models.CharField(max_length=50, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SLA',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('number', models.CharField(default=slas.models.SLA.generate_ticket_number, max_length=20, unique=True)),
                ('sla_name', models.CharField(max_length=50)),
                ('isCreatedByStudent', models.BooleanField(default=False)),
                ('criteria', models.CharField(max_length=250)),
                ('owner', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('ownersection', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='users.course')),
                ('priority', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='priority.priority', to_field='priority_id')),
            ],
        ),
    ]