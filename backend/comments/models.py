import uuid
from django.db import models
from users.models import User
from incidents.models import Incident
import uuid


# Create your models here.
class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    commentId = models.CharField(max_length=100)
    comment = models.CharField(max_length=200)
    userId = models.ForeignKey(
        User, related_name="userCommentsId", null=True, on_delete=models.SET_NULL
    )
    incidentId = models.ForeignKey(
        Incident, related_name="incidentCommentsId", null=True, on_delete=models.SET_NULL
    )
    isResolved = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.comment
