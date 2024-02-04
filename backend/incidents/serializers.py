from .models import Incident, TicketType
from rest_framework import serializers
from users.models import SecurityGroup, User_security_groups
from django.contrib.auth import get_user_model

class DynamicFieldsCategorySerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop("fields", None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class IncidentSerializer(DynamicFieldsCategorySerializer):
    sla_info = serializers.SerializerMethodField()
    affected_amount = serializers.SerializerMethodField()
    user_ticket_owner = serializers.SerializerMethodField()
    user_username = serializers.SerializerMethodField()
    ticketType_type = serializers.SerializerMethodField()
    security_group_name = serializers.SerializerMethodField()
    technician_name = serializers.SerializerMethodField()

    def get_affected_amount(self, obj):
        if obj.affectedUserSize == 0:
            return "None"
        elif obj.affectedUserSize == 1:
            return "1-50"
        elif obj.affectedUserSize == 2:
            return "51-100"
        elif obj.affectedUserSize == 3:
            return "101+"
        return None

    def get_sla_info(self, obj):
        if obj.slaId:
            return {"sla_name": obj.slaId.sla_name, "criteria": obj.slaId.criteria}
        return None

    def get_user_ticket_owner(self, obj):
        if obj.ticketOwnerId:
            return obj.ticketOwnerId.username
        return None

    def get_user_username(self, obj):
        if obj.userId:
            return obj.userId.username
        return None

    def get_security_group_name(self, obj):
        if obj.security_group:
            return obj.security_group.name
        return None

    def get_ticketType_type(self, obj):
        if obj.ticketType:
            return obj.ticketType.type
        return None

    def get_technician_name(self, obj):
        if obj.assignedTechId:
            return obj.assignedTechId.first_name + " " + obj.assignedTechId.last_name
        return None

    class Meta:
        model = Incident
        fields = "__all__"


class TicketTypeSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = TicketType
        fields = "__all__"


class IncidentDataGridSerializer(serializers.Serializer):
    """Faster Datagrid specific serializer, can be used in a lot of places to speed up load times
    Can't post, patch or delete currently though and only has fields related to datagrid
    """
    id = serializers.UUIDField()
    ticketNumber = serializers.CharField()
    ticketOwnerId = serializers.CharField()
    userId = serializers.CharField()
    status = serializers.CharField(source="status.status_name", default=None)
    priority = serializers.CharField(source="priority.priority_name", default=None)
    assignedTechId = serializers.CharField()
    subject = serializers.CharField()
    resolution_time = serializers.CharField(source="priority.resolution_time", default=None)
    ticketDateTime = serializers.DateTimeField()
    reportDateTime = serializers.DateTimeField()
    sla_status = serializers.CharField(source="sla_status.status_name", default=None)


# Added here the old serializers from user module on which some of the incident views depends on

class SecurityGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = SecurityGroup
        fields = '__all__'
        
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = '__all__'
        
class UserSecurityGroupSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = User_security_groups
        fields = '__all__'