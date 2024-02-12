from ast import Import
from .models import Problem
from incidents.models import Incident
from incidents.serializers import IncidentSerializer
from rest_framework import serializers


class DynamicFieldsCategorySerializer(serializers.ModelSerializer):
    """Defines the Dynamic Fields Serializer, you can use this to do any action on the data
        That being said, these serializers can be seriously slow. Try not to use these for anything but posting
        This serializer can be found in the Django Rest Framework Documentation
        https://www.django-rest-framework.org/api-guide/serializers/
    """

    def __init__(self, *args, **kwargs):
        # Don't pass the 'fields' arg up to the superclass
        fields = kwargs.pop('fields', None)

        # Instantiate the superclass normally
        super().__init__(*args, **kwargs)

        if fields is not None:
            # Drop any fields that are not specified in the `fields` argument.
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ProblemSerializer(DynamicFieldsCategorySerializer):
    """Basic Problem Serializer, retrieves all data, can handles patches, posts and deletes"""
    class Meta:
        model = Problem
        fields = '__all__'

# Fast Serializer meant for DataGrids


class ProblemFastSerializer(serializers.Serializer):
    """Significantly faster serializer than the basic one, however posting, patching and putting don't seem to function
        Status and Priority get the object they are foreign keyed to, you can see this by removing the source field
    """
    id = serializers.UUIDField()
    userId = serializers.CharField()
    status = serializers.CharField(source='status.status_name', default=None)
    ticketNumber = serializers.IntegerField()
    reportDateTime = serializers.DateTimeField()
    priority = serializers.CharField(
        source='priority.priority_name', default=None)
    summary = serializers.CharField()
    assignedTechId = serializers.CharField()
    ticketOwnerId = serializers.CharField()
