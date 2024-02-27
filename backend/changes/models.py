from datetime import datetime
from datetime import date
import uuid
from django.db import models
from django.contrib.postgres.fields import ArrayField
from django.contrib.auth import get_user_model
from enumchoicefield import ChoiceEnum, EnumChoiceField
# from email.policy import default

from assets.models import Asset
from servicegroup.models import ServiceGroup, Technicians
from users.models import User, Course

#Create your models here.
# Create your models here.
# class Change_Status(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     change_status_id = models.IntegerField(unique=True)
#     name = models.CharField(max_length=100)

# Changes Request Details tab
class RequestType(ChoiceEnum):
     STANDARD  = "Standard"
     NORMAL    = "Normal"
     MAJOR     = "Major"
     EMERGENCY = "Emergency"
     LATENT    = "Latent"

class ChangeHistory(ChoiceEnum):
    NOTBEFORE = "Change has not been completed before"
    FAILED = "Previous change attempted, failed"
    ERRORS = "Previous change completed, with errors"
    SUCCESS = "Previous change completed successfully"

class RedundancyTypes(ChoiceEnum):
    NONE = ""
    MANUAL = "Manual"
    AUTOMATIC = "Automatic"

class ChooseEnvironment(ChoiceEnum):
    INFO = 'Information Only'
    TEST = 'Test'
    PRODUCTION = 'Production'

class EnvironmentMaturity(ChoiceEnum):
    NONE = ""
    OBSOLETE = "Obsolete"
    MATURE_MAINTAINED = "Mature/Maintained"

class DocumentationOfConfiguration(ChoiceEnum):
     COMPLETE    = "Complete/Up to Date"
     INCOMPLETE  = "Incomplete/Out of date"
     HALFLESSER  = "Less than half complete"
     HALFGREATER = "More than half complete"

# Install/Backout Plan tab
class RequiredEmployees(ChoiceEnum):
    NONE = ""
    STAFF = "1-3 staff members required"
    TEAM = "1 team required"
    TEAMS = "Multiple teams required"

class BackOutPlanDifficulty(ChoiceEnum):
     LOW    = "Low"
     MEDIUM = "Medium"
     HIGH   = "High"

# Business Plan tab
class Duration(ChoiceEnum):
     ONEWEEK  = "1 week"
     TWOWEEKS = "2 weeks"
     ONEMO    = "1 month"
     THREEMO  = "3 months"
     SIXMO    = "6 months"

# Change Request Statuses
class ChangeStatus(ChoiceEnum):
    PENDING_APPROVAL = "Pending Approval"
    APPROVED = "Approved"
    SCHEDULED = "Scheduled"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"
    CANCELLED = "Cancelled"
    ROLLBACK = "Rollback"

class PermTemp(ChoiceEnum):
    NONE = ""
    TEMPORARY = "Temporary"
    PERMANENT = "Permanent"


# Related to ticket creation possibly
class Approvals(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

class ChangeRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Change Request Details
    request_type = EnumChoiceField(enum_class=RequestType, default=RequestType.STANDARD, blank=True, null=True)
    request_name = models.CharField(max_length=50)
    assigned_technician = models.ForeignKey(User, related_name="assigned_technicians", null=True, on_delete=models.SET_NULL)
    #assignedTechId = models.ForeignKey(User, related_name="assignedToId", null=True, on_delete=models.SET_NULL)
    requested_by = models.ForeignKey(User, related_name="requesters", null=True, on_delete=models.SET_NULL)
    #requestedById = models.ForeignKey(User, related_name="ChangeUserId", null=True, on_delete=models.SET_NULL)
    request_contact = models.CharField(max_length=50)
    #RISK ASSESSMENT
    recovery_available = models.BooleanField(default=False)
#     redundancy = models.CharField(max_length=50, null=True, blank=True)
#     redundancy_type = models.CharField(max_length=50, choices=RedundancyTypes.choices, default=RedundancyTypes.NONE, null=True, blank=True)
    redundancy_type = EnumChoiceField(enum_class=RedundancyTypes, max_length=10, default=RedundancyTypes.NONE, blank=True, null=True)
#     change_history = models.CharField(max_length=50, null=True, blank=True)
    change_history = EnumChoiceField(enum_class=ChangeHistory, default=ChangeHistory.NOTBEFORE, blank=True, null=True)
    testing_completed = models.BooleanField(default=False)
    testing_desc = models.TextField(null=True, blank=True)
    choose_environment = EnumChoiceField(enum_class=ChooseEnvironment, default=ChooseEnvironment.INFO, blank=True, null=True)
    are_there_dependencies = models.BooleanField(default=False)
    environment_maturity = EnumChoiceField(enum_class=EnvironmentMaturity, default=EnvironmentMaturity.NONE, null=True, blank=True)
    # (these assets are selectable from the assets module, where they are made)
    assets = models.ManyToManyField(Asset, blank=True)  # a change request can involve multiple assets
#     documentation_of_config = models.CharField(max_length=50, null=True, blank=True)
    documentation_of_config = EnumChoiceField(enum_class=DocumentationOfConfiguration, max_length=20, default=DocumentationOfConfiguration.COMPLETE, blank=True, null=True)
    # INSTALL/BACKOUT PLAN
    adequate_install_window = models.BooleanField(default=False)
    install_desc = models.TextField(null=True, blank=True)
    required_employees = EnumChoiceField(enum_class=RequiredEmployees, default=RequiredEmployees.NONE, blank=True, null=True)
    adequate_backout_window = models.BooleanField(default=False)
    backout_difficulty = EnumChoiceField(enum_class=BackOutPlanDifficulty, default=BackOutPlanDifficulty.LOW, blank=True, null=True)
    backout_desc = models.TextField(null=True, blank=True)
    # BUSINESS CASE
    start_date = models.DateField(default=date.today)
    perm_or_temp = EnumChoiceField(enum_class=PermTemp, default=PermTemp.NONE, blank=True, null=True)
    #(possibly call it "duration" instead of time to implement)
    duration = EnumChoiceField(enum_class=Duration, default=Duration.ONEWEEK, blank=True, null=True)
#     time_to_implement = models.CharField(max_length=50, null=True, blank=True)
    business_case_desc = models.TextField(null=True, blank=True)
    # PRIORITY TAB
    impact_slider = models.IntegerField()
    urgency_slider = models.IntegerField()
    priority_slider = models.IntegerField()
    new_change_data_sheet = models.TextField()
    # Non Form Fields
    change_status = EnumChoiceField(ChangeStatus, default=ChangeStatus.PENDING_APPROVAL)
    # Additional foreign keys
    #impact = models.ForeignKey(Priority, related_name="change_request_impact", null=True, on_delete=models.SET_NULL, to_field="priority_id")
    #urgency = models.ForeignKey(Priority, related_name="change_request_urgency", null=True, on_delete=models.SET_NULL, to_field="priority_id")
    #priority = models.ForeignKey(Priority, related_name="change_request_priority", null=True, on_delete=models.SET_NULL, to_field="priority_id")
    # requestOwnerSection = models.ForeignKey(Course, related_name="change_requests", null=True, on_delete=models.SET_NULL)
    ticket_number = models.CharField(max_length=100, unique=True, default=lambda: ChangeRequest.generate_ticket_number())

@staticmethod
def generate_ticket_number():
        count = ChangeRequest.objects.count()
        number = (count % 99999) + 1
        padded_number = str(number).zfill(5)
        date_str = date.today().strftime("%Y%m%d")
        return f"CHR{padded_number}-{date_str}"

requestNumber = models.CharField(
        max_length=20, unique=True, default=generate_ticket_number)

class Meta:
        verbose_name_plural = "Change Requests"

def __str__(self):
        return self.ticket_number

