import uuid
from django.db import models
from users.models import Course
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model
from enumchoicefield import ChoiceEnum, EnumChoiceField

# Create your models here.
class Asset_Status(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset_status_id = models.IntegerField(unique=True)
    name = models.CharField(max_length=100)

class Categories(ChoiceEnum):
    HARDWARE = "Hardware"
    SOFTWARE = "Software"
    OTHER = "Other"
    NONE = "None"

class Asset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    asset_tag = models.IntegerField(default=1)
    serial_number = models.CharField(max_length=100)
    asset_name = models.CharField(max_length=100)
    category = EnumChoiceField(enum_class=Categories, max_length=10)
    ip_address = models.CharField(max_length=100, null=True, blank=True)
    asset_dependencies = ArrayField(
        models.CharField(max_length=100), default=list, null=True, blank=True
    )
    user = models.ForeignKey(
        get_user_model(), to_field="id", null=True, on_delete=models.SET_NULL
    )
    status = models.ForeignKey(
        Asset_Status, to_field="asset_status_id", null=True, on_delete=models.SET_NULL
    )
    location = models.CharField(max_length=100)
    description = models.CharField(max_length=100, null=True, blank=True)
    date_created = models.DateTimeField(auto_now=False, auto_now_add=True, null=True)
    course = models.ForeignKey(
        Course, to_field="id", null=True, on_delete=models.SET_NULL
    )

    # License Information
    vendor_name = models.CharField(max_length=100, null=True, blank=True)
    product_name = models.CharField(max_length=100, null=True, blank=True)
    current_version = models.CharField(max_length=100, null=True, blank=True)
    license_name = models.CharField(max_length=100, null=True, blank=True)
    license_type = models.CharField(max_length=100, null=True, blank=True)
    vendor_support = models.BooleanField(null=True, blank=True)
    license_cost = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)

    

    # Rest of your model data

    def save(self, *args, **kwargs):
        # This means that the model isn't saved to the database yet
        if self._state.adding:
            # Get the maximum display_id value from the database
            last_id = Asset.objects.all().aggregate(largest=models.Max('asset_tag'))['largest']

            # aggregate can return None! Check it first.
            # If it isn't none, just use the last ID specified (which should be the greatest) and add one to it
            if last_id is not None:
                self.asset_tag = last_id + 1

        super(Asset, self).save(*args, **kwargs)
