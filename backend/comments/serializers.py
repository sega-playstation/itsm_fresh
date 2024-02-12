from .models import Comment
from rest_framework import serializers
from incidents.serializers import DynamicFieldsCategorySerializer


class CommentSerializer(DynamicFieldsCategorySerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class CommentViewSerializer(serializers.Serializer):
    """Fast Comment Serializer, can't post, patch or delete with however"""
    id = serializers.UUIDField()
    commentId = serializers.CharField()
    comment = serializers.CharField()
    owner = serializers.CharField()
    date = serializers.DateTimeField()
