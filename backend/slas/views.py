from .models import SLA, SLA_status
from .serializers import SLASerializer, SLADataGridSerializer, SLAStatusSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView
from rest_framework.response import Response
from django.db.models import Q


class SLAViewSet(viewsets.ModelViewSet):
    """Default SLA ViewSet

    Allows for any method ie GET,POST,PUT,DELETE however has no filtering, should be used for posting only really
    Not secure, however can be used to see all tickets in API view, or
    specific tickets without the need to do something like 127.0.0.1:8000/sla/?slaId={uuid}
    """

    serializer_class = SLASerializer
    queryset = SLA.objects.all()
    permission_classes = [permissions.IsAuthenticated]


class SingleSLAAPIView(APIView):
    serializer_class = SLASerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params.get("slaId")
        if id is not None:
            sla = SLA.objects.get(id=id)
            serializer = SLASerializer(sla)
            return Response(serializer.data)


class SLAAPIView(APIView):
    serializer_class = SLADataGridSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user.role_id
        section_id = request.user.course_id_id
        toggle_student_data = request.META.get("HTTP_TOGGLE_STUDENT_DATA")

        if user == 1:
            slaData = SLA.objects.filter(
                Q(owner_id__role_id__roleId=1)
                | Q(isCreatedByStudent=toggle_student_data)
                | Q(owner_id=request.user.id)
            )
            serializer = self.serializer_class(slaData, many=True)
            return Response(serializer.data)
        elif user == 3:
            if toggle_student_data:
                slaData = SLA.objects.filter(
                    Q(owner_id__role_id__roleId=1)
                    | (Q(isCreatedByStudent=toggle_student_data) & Q(ownersection_id=section_id))
                    | Q(owner_id=request.user.id)
                )
            serializer = self.serializer_class(slaData, many=True)
            return Response(serializer.data)
        elif user == 4:
            if toggle_student_data:
                slaData = SLA.objects.filter(
                    Q(owner_id__role_id__roleId=1)
                    | (Q(isCreatedByStudent=toggle_student_data) & Q(ownersection_id=section_id))
                    | Q(owner_id=request.user.id)
                )
            serializer = self.serializer_class(slaData, many=True)
            return Response(serializer.data)
        else:
            response = {
                "success": request.user.role_id,
                "status_code": status.HTTP_403_FORBIDDEN,
                "message": request.user.id,
            }
            return Response(response, status.HTTP_403_FORBIDDEN)


class PostSLAAPIView(APIView):
    serializer_class = SLASerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EditSLAAPIView(APIView):
    serializer_class = SLASerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, sla_id, *args, **kwargs):
        user = request.user

        try:
            sla_instance = SLA.objects.get(id=sla_id)
        except SLA.DoesNotExist:
            return Response({"error": "SLA not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(
            instance=sla_instance, data=request.data, partial=True
        )

        if serializer.is_valid():
            if user.role_id == 1:
                serializer.save()
            elif user.role_id == 3 and str(serializer.validated_data["owner"].id) == str(user.id) or str(serializer.validated_data["ownersection"]) == str(user.course_id):
                serializer.save()
            elif user.role_id == 4 and str(serializer.validated_data["owner"].id) == str(user.id):
                serializer.save()
            else:
                return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class StatusViewSet(viewsets.ModelViewSet):
    serializer_class = SLAStatusSerializer
    queryset = SLA_status.objects.order_by("status_id")
