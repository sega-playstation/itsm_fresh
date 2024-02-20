from rest_framework import serializers
from .models import ChangeRequest

class ChangeRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChangeRequest
        fields = '__all__'  # Adjust fields if you need only specific ones