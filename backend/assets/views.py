from .models import Asset
from django.db.models import Q
from .serializers import *
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions


class AdminAssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return super().get_queryset()
        else:
            return Asset.objects.none()

class GeneralAssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.none()
    serializer_class = GeneralAssetSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        roleID = user.role_id
            
        if roleID == 3:
            courses = [str(uuid) for uuid in user.courseId]
            courseID = self.request.query_params.get('courseID') or courses[0]
            
            course = Course.objects.get(id=courseID)
            
            if courseID in courses:
                return Asset.objects.filter(Q(course=course) | Q(course=None) | Q(user=user))
            return super().get_queryset()
        elif roleID == 4:
            try:
                courses = [str(uuid) for uuid in user.courseId]
                courseID = courses[0]
                course = Course.objects.get(id=courseID)
            except:
                return Response({"error": "Invalid student ID found."}, status=status.HTTP_403_FORBIDDEN)
            
            return Asset.objects.filter(Q(course=course) | Q(course=None) | Q(user=user))
        else:
            return super().get_queryset()
    
    def destroy(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()
        courses = [str(uuid) for uuid in user.courseId]

        if instance.course is not None:
            if user.role_id == 3 and str(instance.course.id) in courses:
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            elif user.role_id == 4 and user.id == instance.user.id:
                instance.delete()
                return Response(status=status.HTTP_204_NO_CONTENT)
            else:
                return Response({"error": "Unable to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        return Response({"error": "Unauthorized for this action."}, status=status.HTTP_403_FORBIDDEN)
    
class AssetStatusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Asset_Status.objects.all()
    serializer_class = AssetStatusSerializer
    permission_classes = [permissions.AllowAny]