import uuid
from django.db import models
from datetime import date

# Create your models here.
class ServiceGroup(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)

    def __str__(self):
        return str(self.name)

class Technicians(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    serviceGroup = models.ForeignKey(ServiceGroup, to_field="id", null=False, on_delete=models.CASCADE)

    def __str__(self):
        return str(self.name)