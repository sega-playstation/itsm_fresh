from .models import SLA, SLA_status
from incidents.serializers import DynamicFieldsCategorySerializer
from rest_framework import serializers


class SLASerializer(DynamicFieldsCategorySerializer):
    role_name = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()
    response_time = serializers.SerializerMethodField()
    resolution_time = serializers.SerializerMethodField()
    availability = serializers.SerializerMethodField()
    priority_info = serializers.SerializerMethodField()

    class Meta:
        model = SLA
        fields = "__all__"

    def get_role_name(self, obj):
        if obj.owner and obj.owner.role:
            role = obj.owner.role
            return role.name
        return None

    def get_section_name(self, obj):
        if obj.owner and obj.owner.course_id:
            course = obj.owner.course_id
            return course.section
        return None

    def get_response_time(self, obj):
        if obj.priority:
            return obj.priority.response_time
        return None

    def get_resolution_time(self, obj):
        if obj.priority:
            return obj.priority.resolution_time
        return None

    def get_availability(self, obj):
        if obj.priority:
            return obj.priority.availability
        return None

    def get_priority_info(self, obj):
        if obj.priority:
            return {
                "name": obj.priority.priority_name,
                "response_time": obj.priority.response_time,
                "resolution_time": obj.priority.resolution_time,
                "availability": obj.priority.availability,
            }
        return None


class SLADataGridSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    owner = serializers.CharField()
    sla_name = serializers.CharField()
    number = serializers.CharField()
    priority = serializers.CharField(source="priority.priority_name", default=None)
    criteria = serializers.CharField()
    response_time = serializers.CharField(source="priority.response_time", default=None)
    resolution_time = serializers.CharField(
        source="priority.resolution_time", default=None
    )
    availability = serializers.CharField(source="priority.availability", default=None)
    isCreatedByStudent = serializers.BooleanField()


class SLAStatusSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = SLA_status
        fields = "__all__"
