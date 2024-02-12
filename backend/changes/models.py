<<<<<<< HEAD
from datetime import date
from django.db import models
import uuid
=======
from django.db import models
import uuid
from datetime import date
>>>>>>> fde268c9814b79f49d05defa63c74f96c858c11b
from assets.models import Asset
from priority.models import Priority
from users.models import User, Course

<<<<<<< HEAD
# Create your models here.


class Approvals(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


class ChangeRequest(models.Model):
    def generate_ticket_number():
        count = ChangeRequest.objects.count()
        number = (count % 99999) + 1
        padded_number = str(number).zfill(5)
        date_str = date.today().strftime("%Y%m%d")
        return f"CHR{padded_number}-{date_str}"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    requestNumber = models.CharField(
        default=generate_ticket_number, unique=True, max_length=20
    )
    ticketOwnerId = models.ForeignKey(
        User, related_name="ChangeTicketOwnerId", null=True, on_delete=models.SET_NULL
    )
    status = models.IntegerField(default=1)
    requestType = models.CharField(max_length=100)
    requestDateTime = models.DateTimeField(auto_now=False, auto_now_add=False)
    projectName = models.CharField(max_length=100)
    requestName = models.CharField(max_length=100)
    assignedTechId = models.ForeignKey(
        User, related_name="assignedToId", null=True, on_delete=models.SET_NULL
    )
    requestOwnerSection = models.ForeignKey(
        Course, related_name="courseId", null=True, on_delete=models.SET_NULL
    )
    department = models.CharField(max_length=100)
    requestedById = models.ForeignKey(
        User, related_name="ChangeUserId", null=True, on_delete=models.SET_NULL
    )
    requestContact = models.CharField(max_length=100)
    impact = models.ForeignKey(
        Priority,
        to_field="priority_id",
        related_name="changeimpact_id",
        null=True,
        on_delete=models.SET_NULL,
    )
    urgency = models.ForeignKey(
        Priority,
        to_field="priority_id",
        related_name="changeurgency_id",
        null=True,
        on_delete=models.SET_NULL,
    )
    priority = models.ForeignKey(
        Priority,
        to_field="priority_id",
        related_name="changepriority_id",
        null=True,
        on_delete=models.SET_NULL,
    )
    description = models.CharField(max_length=300)
    isActive = models.BooleanField(default=True)
    approvals = models.ForeignKey(
        Approvals, related_name="approvals", null=True, on_delete=models.SET_NULL
    )
    # Asset
    assets = models.ManyToManyField(Asset)
    # Install & Backout Description
    install_plan_description = models.CharField(max_length=300, null=True)
    backout_plan_description = models.CharField(max_length=300, null=True)
    # Business Justification
    start_date = models.DateTimeField(auto_now=False, auto_now_add=False, null=True)
    end_date = models.DateTimeField(auto_now=False, auto_now_add=False, null=True)
    purpose = models.CharField(max_length=300, null=True)
    need = models.CharField(max_length=300, null=True)
    duration = models.CharField(max_length=300, null=True)
    # Risk Assessment
    doc_config = models.CharField(max_length=100, null=True)
    environment = models.CharField(max_length=100, null=True)
    redundancy = models.CharField(max_length=100, null=True)
    environment_maturity = models.CharField(max_length=100, null=True)
    time_to_implement = models.CharField(max_length=100, null=True)
    change_history = models.CharField(max_length=100, null=True)
    deployment_window = models.CharField(max_length=100, null=True)
    num_of_staff = models.CharField(max_length=100, null=True)
    testing = models.CharField(max_length=100, null=True)
    backout_plan_risk = models.CharField(max_length=100, null=True)
    scheduling = models.CharField(max_length=100, null=True)
=======

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
>>>>>>> fde268c9814b79f49d05defa63c74f96c858c11b
