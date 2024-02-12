from .models import *
from users.models import Course
from rest_framework import serializers

class AssetStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset_Status
        fields = ["id", "asset_status_id", "name"]
        
class AssetDependencySerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["id", "asset_tag", "asset_name", "category"]
class AssetSerializer(serializers.ModelSerializer):
    status_name = serializers.ReadOnlyField(source="status.name")
    user_name = serializers.ReadOnlyField(source="user.get_full_name")
    asset_dependencies_details = serializers.SerializerMethodField()
    class Meta:
        model = Asset
        fields = ["id", "status_name", "user_name", "serial_number", "asset_tag", "asset_name", "category", "ip_address", "asset_dependencies", "asset_dependencies_details", "status", "location", "description", "vendor_name", "product_name", "current_version", "license_name", "license_type", "vendor_support", "license_cost"]
        
    def get_asset_dependencies_details(self, asset):
        asset_dependencies_ids = asset.asset_dependencies
        asset_dependencies = Asset.objects.filter(id__in=asset_dependencies_ids)
        serializer = AssetDependencySerializer(asset_dependencies, many=True)
        return serializer.data

    def get_request_user(self):
        return self.context['request'].user
        
    def create(self, validated_data):
        admin = self.get_request_user()
        asset = super().create(validated_data)
        asset.user = admin
        asset.course = None
        
        asset.save()
        return asset

class GeneralAssetSerializer(serializers.ModelSerializer):
    status_name = serializers.ReadOnlyField(source="status.name")
    user_name = serializers.ReadOnlyField(source="user.get_full_name")
    class Meta:
        model = Asset
        fields = ["id", "status_name", "user_name", "serial_number", "asset_tag", "asset_name", "category", "ip_address", "asset_dependencies", "status", "location", "description", "vendor_name", "product_name", "current_version", "license_name", "license_type", "vendor_support", "license_cost"]
        
    def get_request_user(self):
        return self.context['request'].user

    def create(self, validated_data):
        user = self.get_request_user()
        courses = [str(uuid) for uuid in user.courseId]
        
        if user.role_id in [3, 4]:
            courseID = self.context.get('request').query_params.get("courseID") or  str(user.courseId[0])
            
            if courseID is not None and courseID in courses:
                course = Course.objects.get(id=courseID)
                asset = super().create(validated_data)
                asset.user = user
                asset.course = course
                asset.save()
                return asset
            raise serializers.ValidationError("Course ID is required.")
        raise serializers.ValidationError("Invalid Role ID.")
        
    def update(self, instance, validated_data):
        user = self.get_request_user()
        courses = [str(uuid) for uuid in user.courseId]

        if instance.course is not None:
            if user.role_id == 3 and str(instance.course.id) in courses:
                return super().update(instance, validated_data)
            elif user.role_id == 4 and user.id == instance.user.id:
                return super().update(instance, validated_data)
            else:
                raise serializers.ValidationError("Unable to perform this action.")
        raise serializers.ValidationError("Unauthorized for this action.")
    
    