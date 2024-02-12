from datetime import date
from django.db import models
from priority.models import Status, Priority
from users.models import User, Course
import uuid

# Create your models here.


class SLA(models.Model):
    def generate_ticket_number():
        count = SLA.objects.count()
        number = (count % 99999) + 1
        padded_number = str(number).zfill(5)
        date_str = date.today().strftime("%Y%m%d")
        return f"SLA{padded_number}-{date_str}"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.CharField(
        default=generate_ticket_number, unique=True, max_length=20
    )
    sla_name = models.CharField(max_length=50)
    owner = models.ForeignKey(User, to_field="id", null=True, on_delete=models.SET_NULL)
    ownersection = models.ForeignKey(
        Course, to_field="id", null=True, on_delete=models.SET_NULL
    )
    priority = models.ForeignKey(
        Priority, to_field="priority_id", null=True, on_delete=models.SET_NULL
    )
    isCreatedByStudent = models.BooleanField(default=False)
    criteria = models.CharField(max_length=250)


class SLA_status(models.Model):
    def ids():
        no = SLA_status.objects.count()
        if no == None:
            return 1
        else:
            return no + 1

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status_id = models.IntegerField(default=ids, unique=True)
    status_name = models.CharField(max_length=50, null=True)
