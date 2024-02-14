from rest_framework import serializers

from .models import ServiceGroup, Technicians

class ServiceGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceGroup
        fields = "__all__"

class TechniciansSerializer(serializers.ModelSerializer):
    serviceGroup = ServiceGroupSerializer()
    class Meta:
        model = Technicians
        fields = "__all__"