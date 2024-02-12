import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.postgres.fields import ArrayField
from .managers import UserManager
from enumchoicefield import ChoiceEnum, EnumChoiceField
from django.utils import timezone
from django.conf import settings
#from symbol import term

# Create your models here.


class SecurityGroup(models.Model):
    securityGroupId = models.UUIDField(
        primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)


class Role(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    roleId = models.IntegerField(unique=True)
    name = models.CharField(max_length=100, unique=True)


class Terms(ChoiceEnum):
    FA = "Fall"
    WI = "Winter"
    SP = "Spring"
    
class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField(max_length=100)  
    term = EnumChoiceField(enum_class=Terms, max_length=10)  
    year = models.PositiveIntegerField(null=True)  
    section = models.PositiveIntegerField()  

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = None
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=255, default='')
    # Commented out as it breaks import of users
    # date_joined = models.DateTimeField(auto_now=True)
    approved = models.BooleanField(default=False) # Not needed anymore but still need to check where else it is being used
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    role = models.ForeignKey(Role, to_field='roleId', related_name='role', null=True,
                             on_delete=models.SET_NULL)
    course_id = models.ForeignKey(
        Course, related_name='course_id', null=True, on_delete=models.SET_NULL)
    # Removed automatic assignment of security group from User and calibrated the table manually
    # security_group = models.ManyToManyField(SecurityGroup, blank=True)
    courseId = ArrayField(models.UUIDField(), blank=False, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    def __str__(self): 
        return self.email
    
    objects = UserManager()
    
# Model for adding and removing sections for an instructor
class Instructor_sections(models.Model):
    instructor_section_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    instructor_id = models.ForeignKey(User, related_name='instructor_id', null=True, on_delete=models.SET_NULL)
    course_id = models.ForeignKey(Course, related_name='instructor_course_id', null=True, on_delete=models.SET_NULL)

# Model for adding and removing sections for any user
class User_security_groups(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey(User, related_name='user_id', null=True, on_delete=models.SET_NULL)
    securitygroup_id = models.ForeignKey(SecurityGroup, related_name='securitygroup_id', null=True, on_delete=models.SET_NULL)
    
# Model for resetting password of any user
class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.SET_NULL)
    ip_address = models.GenericIPAddressField()
    expiry_date = models.DateTimeField()

    def is_expired(self):
        return self.expiry_date <= timezone.now()

    def __str__(self):
        return str(self.id)