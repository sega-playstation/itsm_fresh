from django.shortcuts import render
from .models import Comment
from rest_framework import viewsets, permissions, status
from .serializers import CommentSerializer, CommentViewSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

# Create your views here.


class CommentViewSet(viewsets.ModelViewSet):
    """Comment viewset for posting"""

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]


class CommentFilterViewSet(APIView):
    """Comment view for getting the comments for a specific ticket"""

    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params["commentId"]
        if id != None:
            comment = Comment.objects.filter(commentId=id)
            serializer = CommentViewSerializer(comment, many=True)
            return Response(serializer.data)
