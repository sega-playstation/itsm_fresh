from email.policy import default
from http.client import ImproperConnectionState
from unittest.util import _MAX_LENGTH
from django.db import models
from priority.models import Priority, Status
from users.models import SecurityGroup
import uuid

from users.models import User, Course
# Create your models here.


class Problem(models.Model):
    def ids():
        no = Problem.objects.count()
        if no == None:
            return 1
        else:
            return no + 1
    id = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    userId = models.ForeignKey(
        User, related_name='userProblemId', null=True, on_delete=models.SET_NULL)
    status = models.ForeignKey(
        Status, to_field='status_id', null=True, on_delete=models.SET_NULL)
    reportDateTime = models.DateTimeField(auto_now=False, auto_now_add=False)
    multipleAffectedUser = models.BooleanField()
    affectedUserSize = models.IntegerField()
    impact = models.ForeignKey(
        Priority, to_field='priority_id', related_name='problemimpact_id', null=True, on_delete=models.SET_NULL)
    urgency = models.ForeignKey(
        Priority, to_field='priority_id', related_name='problemurgency_id', null=True, on_delete=models.SET_NULL)
    priority = models.ForeignKey(
        Priority, to_field='priority_id', related_name='problempriority_id', null=True, on_delete=models.SET_NULL)
    ticketOwnerId = models.ForeignKey(
        User, related_name='problemTicketOwner', null=True, on_delete=models.SET_NULL)
    ticketDateTime = models.DateTimeField(auto_now=False, auto_now_add=True)
    assignedTechId = models.ForeignKey(
        User, related_name='problemAssignedTech', null=True, on_delete=models.SET_NULL)
    summary = models.CharField(max_length=100)
    details = models.TextField()
    ticketOwnerSection = models.ForeignKey(
        Course, related_name='problemSection', null=True, on_delete=models.SET_NULL)
    ticketNumber = models.IntegerField(default=ids, unique=True)
    isAssigned = models.BooleanField(default=False)
    security_group = models.ForeignKey(
        SecurityGroup, related_name='problemSecGroup', null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.summary
