from .models import Approvals, ChangeRequest
from .serializers import RequestSerializer, ApprovalsSerializer, ChangeDataGridSerializer, SingleRequestSerializer
from rest_framework import generics, viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q



class ApprovalsViewSet(viewsets.ModelViewSet):
    """Approvals View
    Allows for GET, POST, DELETE and PATCH
    """
    queryset = Approvals.objects.all()
    serializer_class = ApprovalsSerializer
    permission_classes = [permissions.IsAuthenticated]

class RequestViewSet(viewsets.ModelViewSet):
    """Unfiltered Request View
    Allows for GET, POST, DELETE and PATCH
    Unfiltered, so used primarily for POSTing and PATCHing
    """
    queryset = ChangeRequest.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

class SingleRequestAPIView(APIView):
    serializer_class = SingleRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params.get("requestId")
        if id is not None:
            request = ChangeRequest.objects.get(id=id)
            serializer = self.serializer_class(request)
            return Response(serializer.data)

class RequestAPIViewSet(APIView):
    """Filtered Single Request View
    Allows for GET
    Receives a request ID then determines if the current user is allowed to see it
    """
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        requestId = request.query_params['requestId']
        user = request.user

        if(requestId != None):
            incData = ChangeRequest.objects.get(id=requestId)
            serializer = RequestSerializer(incData)

            if(user.role_id == 1):
                return Response(serializer.data)
            elif(user.role_id == 2):
                return Response(serializer.data)
            elif(user.role_id == 3):
                if(incData.assignedTechId_id == user.id or incData.requestedById_id == user.id or incData.ownerId_id == user.id or incData.requestOwnerSection_id == user.course_id_id or incData.requestOwnerSection_id == None):
                    return Response(serializer.data)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
            elif(user.role_id == 4):
                if(incData.assignedTechId_id == user.id or incData.requestedById_id == user.id or incData.ownerId_id == user.id or incData.requestOwnerSection_id == user.course_id_id):
                    return Response(serializer.data)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

class RequestAPIView(APIView):
    """Filtered Request View
    Allows for GET
    Filters Requests based on the current user's role
    Used primarily for the Request Datagrid
    """
    serializer_class = ChangeDataGridSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):

        user = request.user
        if(user.role_id == 1):
            incData = ChangeRequest.objects.all()
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        elif(user.role_id == 2):
            incData = ChangeRequest.objects.all()
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        elif(user.role_id == 3):
            incData = ChangeRequest.objects.filter(
                Q(ticketOwnerId = request.user.id) | Q(assignedTechId_id = request.user.id) | Q(requestedById = request.user.id) | Q(requestOwnerSection = request.user.course_id_id) | Q(requestOwnerSection = None)
            )
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        elif(user.role_id == 4):
            incData = ChangeRequest.objects.filter(
                Q(ticketOwnerId = request.user.id) | Q(assignedTechId_id = request.user.id) | Q(requestedById = request.user.id) | Q(requestOwnerSection = request.user.course_id_id) 
            )
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        else:
            response = {
                'success': False,
                'status_code': status.HTTP_403_FORBIDDEN,
                'message': request.user.id
            }
            return Response(response, status.HTTP_403_FORBIDDEN)
        
class EditRequestAPIView(APIView):
    serializer_class = RequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, change_id, *args, **kwargs):
        user = request.user
        change_instance = ChangeRequest.objects.get(id=change_id)
        serializer = self.serializer_class(
            instance=change_instance, data=request.data, partial=True
        )

        if not change_instance:
            return Response(
                {"error": "Change Request not found"}, status=status.HTTP_400_BAD_REQUEST
            )

        if serializer.is_valid():
            if user.role_id == 1:
                serializer.save()
            elif (user.role_id == 3 
                  and str(serializer.validated_data["requestOwnerSection"].id) == str(user.course_id_id) 
                  or str(serializer.validated_data["ticketOwnerId"].id) == str(user.id)
                  ):
                serializer.save()
            elif (user.role_id == 4 and str(serializer.validated_data["ticketOwnerId"].id) == str(user.id)):
                serializer.save()
            else:
                return Response("Unauthorized", status=status.HTTP_401_UNAUTHORIZED)

            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)