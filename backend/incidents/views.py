from rest_framework.response import Response
from .models import Incident, TicketType
from .serializers import IncidentSerializer, TicketTypeSerializer, IncidentDataGridSerializer
from rest_framework import generics, viewsets, status
from django.shortcuts import get_object_or_404
from rest_framework import permissions
from core.permissions import AdminOrReadOnly, AuthorOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.backends import TokenBackend
from users.models import User, SecurityGroup, User_security_groups
from .serializers import UserSerializer, SecurityGroupSerializer, UserSecurityGroupSerializer
from django.db.models import Q

# Create your views here.

class TicketTypeViewSet(viewsets.ModelViewSet):
    """Basic ticket type view

    Nobody can call this view directly so filtering for roles isn't necessary
    Allows for GET, PATCH, POST, DELETE
    Used primarily just for getting the ticket types out of the data base
    """
    queryset = TicketType.objects.all()
    serializer_class = TicketTypeSerializer


class IncidentViewSet(APIView):
    """Single Incident View, takes in the Incident ID and filters based on role and section

    # 1 (Admin) Can view everything
    # 2 (Technicians) Can only view tickets in their security group UNLESS they are in the service desk, which they can view any tickets that don't have a security group assigned
    # 3 (Instructor) can view tickets in their own section and ones that have no section
    # 4 (Student) can view tickets in their own section, ones that have no section and ones they created
    """
    serializer_class = IncidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Takes in a specific parameter when querying the url example 127.0.0.1:8000/incident/?incidentId=(uuid)
        id = request.query_params['incidentId']
        # Grabs the JWT Token and puts it into a variable
        user = request.user
        if id != None:
            # Grabs the incident with the Id from the url and serializes it
            incident = Incident.objects.get(id=id)
            serializer = IncidentSerializer(incident)
            # Grabs the security groups assigned to the current user
            userData = User_security_groups.objects.filter(user_id=user.id)
            userSecGroup = UserSecurityGroupSerializer(userData, many=True)
            if (user.role_id == 1):
                return Response(serializer.data)

            elif(user.role_id == 2):
                if(str(user.id) == str(serializer.data['ticketOwnerId'])):
                    return Response(serializer.data)
                # Checks for the Service Desk within all security groups to compare
                security = SecurityGroup.objects.get(name="Service Desk")
                serviceDesk = SecurityGroupSerializer(security)
                # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
                inServiceDesk = False
                for index, x in enumerate(userSecGroup.data):
                    if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                        inServiceDesk = True
                # Queries if the security group is the security group for Service Desk (Would be different on production compared to test server)
                #if(str(userSecGroup.data['security_group'][0]) == str(serviceDesk.data['securityGroupId'])):
                if(inServiceDesk):
                    if(serializer.data['security_group'] == None or str(serializer.data['security_group']) == str(serviceDesk.data['securityGroupId'])):
                        return Response(serializer.data)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
                else:
                    if(str(serializer.data['assignedTechId']) == str(user.id)):
                        return Response(serializer.data)
                    if (serializer.data['security_group'] != None):
                        isTrue = False
                        #for serializer.data['security_group'] in userSecGroup.data['securitygroup_id']:
                        # Loops through all security groups assigned to the user and checks if the security group assigned to the ticket is part of the groups
                        for index, x in enumerate(userSecGroup.data):
                            if str(serializer.data['security_group']) in str(userSecGroup.data[index]['securitygroup_id']):
                                isTrue = True
                        if (isTrue == True):
                            return Response(serializer.data)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
            # Compares if you are an instructor and if the section on the incident is the same as in the JWT Token or if there is no section on the tickets
            elif ((user.role_id == 3 and serializer.data['ticketOwnerSection'] == user.course_id_id) or serializer.data['ticketOwnerSection'] == None):
                return Response(serializer.data)
            # Checks if you are a student and if the section on the ticket is the same as your JWT Token as well as makes sure the ticket is assigned or checks if the ticket was created by current user
            elif((user.role_id == 4 and serializer.data['ticketOwnerSection'] == user.course_id_id and serializer.data['isAssigned'] == True) or str(user.id) == str(serializer.data['ticketOwnerId'])):
                return Response(serializer.data)
            else:
                response = {
                    "status": "unauthorized access"
                }
        # If none of the above are true will throw a 401 Unauthorized error to the client
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)

class ViewIncidentViewSet(viewsets.ModelViewSet):
    """Default Incident ViewSet

    Allows for any method ie GET,POST,PUT,DELETE however has no filtering, should be used for posting only really
    Not secure, however can be used to see all tickets in API view, or 
    specific tickets without the need to do something like 127.0.0.1:8000/incident/?incidentId={uuid}
    """
    serializer_class = IncidentSerializer
    queryset = Incident.objects.all()
    permission_classes = [permissions.IsAuthenticated]

# Gets a single incident for editing purposes, Admins can edit anything
# Technicians can only edit tickets that are in their security group UNLESS they are in the service desk, as service desk technicans have to be able to edit and reassign the tickets
# Instructors can only edit tickets they made and Students can only edit their own
# Difference between this view and the single view is that edit can't view or edit tickets with no course


class EditIncidentAPIView(APIView):
    """Gets a single incident for editing purposes

    Admins can edit anything
    Technicians can only edit tickets that are in their security group UNLESS they are in the service desk, 
    as service desk technicans have to be able to edit and reassign the tickets
    Instructors can only edit tickets they made and Students can only edit their own
    Difference between this view and the single view is that edit can't view or edit tickets with no course
    """
    serializer_class = IncidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params['incidentId']
        user = request.user
        # Grabs the security groups assigned to the current user
        userData = User_security_groups.objects.filter(user_id=user.id)
        userSecGroup = UserSecurityGroupSerializer(userData, many=True)
        if id != None:
            incident = Incident.objects.get(id=id)
            serializer = IncidentSerializer(incident)
            if (user.role_id == 1):
                return Response(serializer.data)
            elif(user.role_id == 2):
                if(str(user.id) == str(serializer.data['ticketOwnerId'])):
                    return Response(serializer.data)
                # Checks for the Service Desk within all security groups to compare
                security = SecurityGroup.objects.get(name="Service Desk")
                serviceDesk = SecurityGroupSerializer(security)
                # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
                inServiceDesk = False
                for index, x in enumerate(userSecGroup.data):
                    if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                        inServiceDesk = True
                # Queries if the security group is the security group for Service Desk (Would be different on production compared to test server)
                if(inServiceDesk):
                    # Filters data based on if it has no security group or if the security group attached is the service desk
                    if(serializer.data['security_group'] == None or str(serializer.data['security_group']) == str(serviceDesk.data['securityGroupId'])):
                        return Response(serializer.data)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
                else:
                    if(str(serializer.data['assignedTechId']) == str(user.id)):
                        return Response(serializer.data)
                    if (serializer.data['security_group'] != None):
                        isTrue = False
                        # Loops through all security groups assigned to the user and checks if the security group assigned to the ticket is part of the groups
                        for index, x in enumerate(userSecGroup.data):
                            if str(serializer.data['security_group']) in str(userSecGroup.data[index]['securitygroup_id']):
                                isTrue = True
                        if (isTrue == True):
                            return Response(serializer.data)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
            # Takes in the role and makes sure that the user can only see the tickets they created
            elif ((user.role_id == 3 and serializer.data['ticketOwnerSection'] == user.course_id_id) or serializer.data['ticketOwnerSection'] == None):
                # and (str(user.id) == str(serializer.data['ticketOwnerId']))
                return Response(serializer.data)
            elif(user.role_id == 4 and (str(user.id) == str(serializer.data['ticketOwnerId']))):
                return Response(serializer.data)
            # If none of the above are true will throw a 401 Unauthorized error to the client
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request):
        """
        This functions pretty much the same as the get above it, 
        however now it's updating the ticket rather than getting the information
        Same role filtering as above
        """
        id = request.query_params['incidentId']
        user = request.user
        if id != None:
            incident = Incident.objects.get(id=id)
            serializer = IncidentSerializer(incident)
            # Grabs the security groups assigned to the current user
            userData = User_security_groups.objects.filter(user_id=user.id)
            userSecGroup = UserSecurityGroupSerializer(userData, many=True)
            if (user.role_id == 1):
                serializer = IncidentSerializer(incident, data=request.data)
                # Makes sure the serializer is valid before saving the data and returning the response
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            elif(user.role_id == 2):
                # Checks for the Service Desk within all security groups to compare
                security = SecurityGroup.objects.get(name="Service Desk")
                serviceDesk = SecurityGroupSerializer(security)
                # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
                inServiceDesk = False
                for index, x in enumerate(userSecGroup.data):
                    if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                        inServiceDesk = True
                if(str(user.id) == str(serializer.data['ticketOwnerId'])):
                    serializer = IncidentSerializer(
                        incident, data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data)
                if(inServiceDesk):
                    if(serializer.data['security_group'] == None or str(serializer.data['security_group']) == str(serviceDesk.data['securityGroupId'])):
                        serializer = IncidentSerializer(
                            incident, data=request.data)
                        if serializer.is_valid():
                            serializer.save()
                            return Response(serializer.data)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
                else:
                    if(str(serializer.data['assignedTechId']) == str(user.id)):
                        serializer = IncidentSerializer(
                            incident, data=request.data)
                        if serializer.is_valid():
                            serializer.save()
                            return Response(serializer.data)
                    if (serializer.data['security_group'] != None):
                        isTrue = False
                        # Loops through all security groups assigned to the user and checks if the security group assigned to the ticket is part of the groups
                        for index, x in enumerate(userSecGroup.data):
                            if str(serializer.data['security_group']) in str(userSecGroup.data[index]['securitygroup_id']):
                                isTrue = True
                        if (isTrue == True):
                            serializer = IncidentSerializer(
                                incident, data=request.data)
                            if serializer.is_valid():
                                serializer.save()
                                return Response(serializer.data)
                    else:
                        return Response(status=status.HTTP_401_UNAUTHORIZED)
            # Takes in the role and makes sure that the user can only edit the tickets they created
            elif ((user.role_id == 3 and serializer.data['ticketOwnerSection'] == user.course_id_id) or serializer.data['ticketOwnerSection'] == None):
                serializer = IncidentSerializer(incident, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            elif(user.role_id == 4 and str(user.id) == str(serializer.data['ticketOwnerId'])):
                serializer = IncidentSerializer(incident, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            else:
                response = {
                    "status": "unauthorized access",
                }
        return Response(response, status=status.HTTP_401_UNAUTHORIZED)

class IncidentAPIView(APIView):
    """Incident View for DataGrid Filters what tickets can be seen based on current user role

    Admins (1) can see every ticket
    Technicians (2) should only see ones assigned to their security group however Service Desk should be able to see all tickets except ones assigned to security groups already
    Instructors(3) should be able to see all tickets in their section or tickets without a section
    Students (4) Should only be able to see tickets created by themselves, assigned to their section or ones without a section
    """
    serializer_class = IncidentDataGridSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user.role_id
        if user == 1:

            incData = Incident.objects.select_related(
                'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').all()
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        if (user == 2):
            userId = request.user.id
            # Grabs the security groups assigned to the current user
            userData = User_security_groups.objects.filter(user_id=userId)
            userSecGroup = UserSecurityGroupSerializer(userData, many=True)
            # Checks for the Service Desk within all security groups to compare
            security = SecurityGroup.objects.get(name="Service Desk")
            serviceDesk = SecurityGroupSerializer(security)
            # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
            inServiceDesk = False
            for index, x in enumerate(userSecGroup.data):
                if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                    inServiceDesk = True
            #if(str(userSecGroup.data['security_group'][0]) == str(serviceDesk.data['securityGroupId'])):
            if(inServiceDesk):
                # Q Function within here acts as an OR function within the Incident.objects.filter as or doesn't work, asks if security group is none or if it is the service desk and displays data based on that
                incData = Incident.objects.select_related(
                    'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').filter(Q(security_group=None) | Q(security_group=serviceDesk.data['securityGroupId']))
                serializer = self.serializer_class(incData, many=True)
                return Response(serializer.data)
            else:
                # Raw query to the database using SQL, grabs all incident tickets where the security group of the user is the security group assigned to the ticket
                # Since users can have multiple security groups (unless they are service desk) it needs that IN to perform a subquery
                incidentData = Incident.objects.raw(
                    'SELECT * FROM incidents_incident i WHERE "ticketOwnerId_id"::uuid = %s OR "assignedTechId_id"::uuid = %s OR i.security_group_id IN (SELECT s.securitygroup_id_id FROM users_user_security_groups s WHERE s.user_id_id = %s);', [userId, userId, userId])
                serializer = self.serializer_class(incidentData, many=True)
                return Response(serializer.data)
        if user == 3:

            incData = Incident.objects.select_related(
                'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').filter(
                Q(ticketOwnerSection_id=request.user.course_id_id) | Q(ticketOwnerSection_id=None))
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        if user == 4:
            incData = Incident.objects.select_related(
                'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').filter(
                Q(ticketOwnerId=request.user.id) | Q(ticketOwnerSection_id=request.user.course_id_id, isAssigned=True) | Q(ticketOwnerSection_id=None))
            serializer = self.serializer_class(incData, many=True)
            return Response(serializer.data)
        else:
            response = {
                'success': False,
                'status_code': status.HTTP_403_FORBIDDEN,
                'message': 'Request is forbidden'
            }
            return Response(response, status.HTTP_403_FORBIDDEN)

    def post(self, request):
        serializer = IncidentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProblemsRelatedView(APIView):
    """ 
    View for grabbing problems that are related to the incidents
    Also updates incident tickets with the incoming problemId and relates them to that problem
    """
    serializer_class = IncidentDataGridSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Grabs all incidents that don't have a problem already tied to it
        incData = Incident.objects.filter(problemsRelated=None)
        serializer = self.serializer_class(incData, many=True)
        return Response(serializer.data)

    def patch(self, request):
        # Grabs the incoming patch request data and puts it into a variable
        data = request.data
        # Grabs the length of the incoming array of incident ID's
        length = len(request.data['dependencies'])
        instances = []
        # Loops through the array of incident ID's
        for x in range(0, length):
            # Gets the incident ID from the array
            incidentId = data['dependencies'][x]
            problemsRelated = data['problemsRelated']
            # Grabs the full incident from the database with that incident
            obj = Incident.objects.get(id=incidentId)
            # Changes the problems related field to be the problem ID that came in
            obj.problemsRelated_id = problemsRelated
            obj.save()
            # Adds the current incident to an array
            instances.append(obj)
        # Serializes array of incident objects and updates the database
        serializer = IncidentSerializer(instances, many=True)
        return Response(serializer.data)




class RetrieveRelatedProblems(APIView):
    """
    Retrieves incidents that have the related problem ID of the problemID being passed in
    Used for viewing Problems and seeing the incidents that relate to it
    """
    serializer_class = IncidentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params['problemsRelated']
        if id != None:
            incident = Incident.objects.filter(problemsRelated=id)
            serializer = IncidentDataGridSerializer(incident, many=True)
            return Response(serializer.data)
