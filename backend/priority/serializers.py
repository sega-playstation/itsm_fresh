from ast import Import
from .models import Status, Priority
from incidents.serializers import DynamicFieldsCategorySerializer, IncidentDataGridSerializer
from rest_framework import serializers


class StatusSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = Status
        fields = '__all__'


class PrioritySerializer(DynamicFieldsCategorySerializer):

    class Meta:
        model = Priority
        fields = '__all__'
