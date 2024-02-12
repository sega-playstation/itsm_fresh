from django.db import models
import uuid
from datetime import date
from assets.models import Asset
from priority.models import Priority
from users.models import User, Course


# Assuming User, Asset, Priority, and other related models are defined similarly to your existing models.

class ChangeRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_type = models.CharField(max_length=20)
    ticket_number = models.CharField(max_length=100, unique=True)
    request_name = models.CharField(max_length=50)
    assigned_technician = models.CharField(max_length=20)  # Consider changing to a ForeignKey if referencing a User model
    requested_by = models.CharField(max_length=20)  # Consider changing to a ForeignKey if referencing a User model
    request_contact = models.CharField(max_length=50)

    impact_slider = models.IntegerField()
    urgency_slider = models.IntegerField()
    priority_slider = models.IntegerField()
    new_change_data_sheet = models.TextField()

    recovery_available = models.BooleanField(default=False)
    redundancy = models.CharField(max_length=50, null=True, blank=True)
    change_history = models.CharField(max_length=50, null=True, blank=True)
    testing_completed = models.BooleanField(default=False)
    testing_desc = models.TextField(null=True, blank=True)
    choose_environment = models.CharField(max_length=50, null=True, blank=True)
    are_there_dependencies = models.BooleanField(default=False)
    assets = models.CharField(max_length=200, null=True, blank=True)  # Consider changing to a ManyToManyField if referencing an Asset model
    current_environment_maturity = models.CharField(max_length=50, null=True, blank=True)
    documentation_of_config = models.CharField(max_length=50, null=True, blank=True)

    adequate_install_window = models.BooleanField(default=False)
    required_employees = models.CharField(max_length=50, null=True, blank=True)
    install_desc = models.TextField(null=True, blank=True)
    adequate_backout_window = models.BooleanField(default=False)
    backout_difficulty = models.CharField(max_length=50, null=True, blank=True)
    backout_desc = models.TextField(null=True, blank=True)

    start_date = models.DateTimeField(default=datetime.now)
    perm_or_temp = models.BooleanField(default=False)
    time_to_implement = models.CharField(max_length=50, null=True, blank=True)
    business_case_desc = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Change Requests"

    def __str__(self):
        return self.ticket_number
