import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
# from django.contrib.auth import get_user_model
# from enumchoicefield import ChoiceEnum, EnumChoiceField
from datetime import datetime
# from assets.models import Asset
# rom priority.models import Priority
# from users.models import User, Course

class Approvals(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

class ChangeRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request_type = models.CharField(max_length=20)
    ticket_number = models.CharField(max_length=100, unique=True)
    request_name = models.CharField(max_length=50)
    # assigned_technician = models.ForeignKey(User, related_name="assigned_technicians", null=True, on_delete=models.SET_NULL)
    # #assignedTechId = models.ForeignKey(User, related_name="assignedToId", null=True, on_delete=models.SET_NULL)
    # requested_by = models.ForeignKey(User, related_name="requesters", null=True, on_delete=models.SET_NULL)
    # #requestedById = models.ForeignKey(User, related_name="ChangeUserId", null=True, on_delete=models.SET_NULL)
    # request_contact = models.CharField(max_length=50)
 # PRIORITY TAB
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
    #ASSETS
    #assets = models.ManyToManyField(Asset, blank=True)  # a change request can involve multiple assets
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

    # Additional foreign keys
    #impact = models.ForeignKey(Priority, related_name="change_request_impact", null=True, on_delete=models.SET_NULL, to_field="priority_id")
    #urgency = models.ForeignKey(Priority, related_name="change_request_urgency", null=True, on_delete=models.SET_NULL, to_field="priority_id")
    #priority = models.ForeignKey(Priority, related_name="change_request_priority", null=True, on_delete=models.SET_NULL, to_field="priority_id")
    # requestOwnerSection = models.ForeignKey(Course, related_name="change_requests", null=True, on_delete=models.SET_NULL)

# @staticmethod
# def generate_ticket_number():
#         count = ChangeRequest.objects.count()
#         number = (count % 99999) + 1
#         padded_number = str(number).zfill(5)
#         date_str = date.today().strftime("%Y%m%d")
#         return f"CHR{padded_number}-{date_str}"

# requestNumber = models.CharField(
#         max_length=20, unique=True, default=generate_ticket_number)

# class Meta:
#         verbose_name_plural = "Change Requests"

# def __str__(self):
#         return self.ticket_number

