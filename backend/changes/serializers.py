from .models import Approvals, ChangeRequest
from rest_framework import serializers

class DynamicFieldsCategorySerializer(serializers.ModelSerializer):
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

class RequestSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = ChangeRequest
        fields = '__all__'
        
class SingleRequestSerializer(serializers.ModelSerializer):
    user_username = serializers.SerializerMethodField()
    technician_name = serializers.SerializerMethodField()
    asset_names = serializers.SerializerMethodField()

    class Meta:
        model = ChangeRequest
        exclude = ['isActive', 'approvals']

    def get_user_username(self, obj):
        if obj.requestedById:
            return obj.requestedById.username
        return None
    
    def get_technician_name(self, obj):
        if obj.assignedTechId:
            return obj.assignedTechId.first_name + " " + obj.assignedTechId.last_name
        return None

    def get_asset_names(self, obj):
        asset_names = [asset.asset_name for asset in obj.assets.all()]
        return asset_names

class ApprovalsSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = Approvals
        fields = '__all__'

class ChangeDataGridSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    requestNumber = serializers.CharField()
    status = serializers.IntegerField()
    projectName = serializers.CharField()
    requestName = serializers.CharField()
    requestType = serializers.CharField()
    assignedTechId = serializers.CharField()
    department = serializers.CharField()
    priority = serializers.CharField(source="priority.priority_name", default=None)
    requestDateTime = serializers.DateTimeField()

