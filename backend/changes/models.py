from datetime import date
import uuid
from django.db import models
from django.contrib.auth import get_user_model
from enumchoicefield import EnumChoiceField, ChoiceEnum
from assets.models import Asset

User = get_user_model()

class RequestType(ChoiceEnum):
    STANDARD = "Standard"
    NORMAL = "Normal"
    MAJOR = "Major"
    EMERGENCY = "Emergency"
    LATENT = "Latent"

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
    COMPLETE = "Complete/Up to Date"
    INCOMPLETE = "Incomplete/Out of date"
    HALFLESSER = "Less than half complete"
    HALFGREATER = "More than half complete"

class RequiredEmployees(ChoiceEnum):
    NONE = ""
    STAFF = "1-3 staff members required"
    TEAM = "1 team required"
    TEAMS = "Multiple teams required"

class BackOutPlanDifficulty(ChoiceEnum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class Duration(ChoiceEnum):
    ONEWEEK = "1 week"
    TWOWEEKS = "2 weeks"
    ONEMO = "1 month"
    THREEMO = "3 months"
    SIXMO = "6 months"

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

class ChangeRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    request_type = EnumChoiceField(enum_class=RequestType, default=RequestType.STANDARD, blank=True, null=True)

    request_name = models.CharField(max_length=50)

    assigned_technician = models.ForeignKey(User, related_name="assigned_technicians", null=True, on_delete=models.SET_NULL)
    requested_by = models.ForeignKey(User, related_name="requesters", null=True, on_delete=models.SET_NULL)

    assigned_technician = models.ForeignKey(User, related_name="assigned_technicians", null=True, on_delete=models.SET_NULL)
    requested_by = models.ForeignKey(User, related_name="requesters", null=True, on_delete=models.SET_NULL)
    request_contact = models.CharField(max_length=50)
    recovery_available = models.BooleanField(default=False)
    redundancy_type = EnumChoiceField(enum_class=RedundancyTypes, default=RedundancyTypes.NONE, blank=True, null=True)
    change_history = EnumChoiceField(enum_class=ChangeHistory, default=ChangeHistory.NOTBEFORE, blank=True, null=True)
    testing_completed = models.BooleanField(default=False)
    testing_desc = models.TextField(null=True, blank=True)
    choose_environment = EnumChoiceField(enum_class=ChooseEnvironment, default=ChooseEnvironment.INFO, blank=True, null=True)
    are_there_dependencies = models.BooleanField(default=False)
    environment_maturity = EnumChoiceField(enum_class=EnvironmentMaturity, default=EnvironmentMaturity.NONE, blank=True, null=True)
    assets = models.ManyToManyField('assets.Asset', blank=True)
    documentation_of_config = EnumChoiceField(enum_class=DocumentationOfConfiguration, default=DocumentationOfConfiguration.COMPLETE, blank=True, null=True)
    adequate_install_window = models.BooleanField(default=False)
    install_desc = models.TextField(null=True, blank=True)
    required_employees = EnumChoiceField(enum_class=RequiredEmployees, default=RequiredEmployees.NONE, blank=True, null=True)
    adequate_backout_window = models.BooleanField(default=False)
    backout_difficulty = EnumChoiceField(enum_class=BackOutPlanDifficulty, default=BackOutPlanDifficulty.LOW, blank=True, null=True)
    backout_desc = models.TextField(null=True, blank=True)
    start_date = models.DateField(default=date.today)
    perm_or_temp = EnumChoiceField(enum_class=PermTemp, default=PermTemp.NONE, blank=True, null=True)
    duration = EnumChoiceField(enum_class=Duration, default=Duration.ONEWEEK, blank=True, null=True)
    business_case_desc = models.TextField(null=True, blank=True)
    impact_slider = models.IntegerField()
    urgency_slider = models.IntegerField()
    priority_slider = models.IntegerField()
    new_change_data_sheet = models.TextField()
    change_status = EnumChoiceField(enum_class=ChangeStatus, default=ChangeStatus.PENDING_APPROVAL)

    class Meta:
        verbose_name_plural = "Change Requests"

    def __str__(self):
        return f"Change Request {self.id}"

    @staticmethod
    def generate_ticket_number():
        count = ChangeRequest.objects.count()
        number = (count % 99999) + 1
        padded_number = str(number).zfill(5)
        date_str = date.today().strftime("%Y%m%d")
        return f"CHR{padded_number}-{date_str}"
