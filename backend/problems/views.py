from django.shortcuts import render
from rest_framework.response import Response
from .models import Problem 
from users.models import User, SecurityGroup, User_security_groups
from .serializers import ProblemSerializer, ProblemFastSerializer
from incidents.serializers import UserSerializer, SecurityGroupSerializer, UserSecurityGroupSerializer
from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.views import APIView
from django.db.models import Q
# Create your views here.
"""
Problem Management
Almost identical to incident management in terms of how the code functions
Role IDs
1. Admin
2. Technician
3. Instructor
4. Student
5. Dummy (Nothing is really coded with this role)
"""


class ProblemViewSet(viewsets.ModelViewSet):
    """Problem View, no filtering, used for testing or for Posting where filtering doesn't matter"""
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [permissions.IsAuthenticated]


class ProblemAPIView(APIView):
    """Problem Data Grid View, Filters what data can be seen based on Role
        Uses the ProblemFastSerializer, load times are significantly faster than the regular Problem Serializer
        However the Fast Serializer only serves certain fields made specifically for the DataGrids
    """
    serializer_class = ProblemFastSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if user.role_id == 1:
            # Caches the data that is foreign keyed on Problems, without doing select_related the load times increase drastically
            probData = Problem.objects.select_related(
                'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').all()
            serializer = self.serializer_class(probData, many=True)
            return Response(serializer.data)
        if user.role_id == 2:
            userId = request.user.id
            # Grabs the security groups assigned to the current user
            userData = User_security_groups.objects.filter(user_id=user.id)
            userSecGroup = UserSecurityGroupSerializer(userData, many=True)
            # Checks for the Service Desk within all security groups to compare
            security = SecurityGroup.objects.get(name="Service Desk")
            serviceDesk = SecurityGroupSerializer(security)
            # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
            inServiceDesk = False
            for index, x in enumerate(userSecGroup.data):
                if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                    inServiceDesk = True
            if(inServiceDesk):
                problemData = Problem.objects.select_related(
                    'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').filter(Q(security_group=None) | Q(
                        security_group=serviceDesk.data['securityGroupId']))
                serializer = self.serializer_class(problemData, many=True)
                return Response(serializer.data)
            else:
                # Raw query to the database using SQL, grabs all problem tickets where the security group of the user is the security group assigned to the ticket
                # Since users can have multiple security groups (unless they are service desk) it needs that IN to perform a subquery
                problemData = Problem.objects.raw(
                    'SELECT * FROM problems_problem p WHERE "ticketOwnerId_id"::uuid = %s OR "assignedTechId_id"::uuid = %s OR p.security_group_id IN (SELECT s.securitygroup_id_id FROM users_user_security_groups s WHERE s.user_id_id = %s);', [userId, userId, userId])
                serializer = self.serializer_class(problemData, many=True)
                return Response(serializer.data)
        if user.role_id == 3:
            # The Q function works as an OR statement, so its where the section is either the users section or no section
            probData = Problem.objects.select_related(
                'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').filter(
                Q(ticketOwnerSection_id=user.course_id_id) | Q(ticketOwnerSection_id=None))
            serializer = self.serializer_class(probData, many=True)
            return Response(serializer.data)
        if user.role_id == 4:
            probData = Problem.objects.select_related(
                'ticketOwnerId', 'userId', 'assignedTechId', 'priority', 'status').filter(Q(ticketOwnerId=user.id) | Q(
                    ticketOwnerSection_id=user.course_id_id, isAssigned=True) | Q(ticketOwnerSection_id=None))
            serializer = self.serializer_class(probData, many=True)
            return Response(serializer.data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


class SingleProblemViewSet(APIView):
    """Viewset that gets a single problem by asking for a problemId in the request"""
    serializer_class = ProblemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params['problemId']
        user = request.user
        if id != None:
            problem = Problem.objects.get(id=id)
            serializer = ProblemSerializer(problem)
            # Grabs the security groups assigned to the current user
            userData = User_security_groups.objects.filter(user_id=user.id)
            userSecGroup = UserSecurityGroupSerializer(userData, many=True)
            if user.role_id == 1:
                return Response(serializer.data)
            if user.role_id == 2:
                # Checks for the Service Desk within all security groups to compare
                security = SecurityGroup.objects.get(name="Service Desk")
                serviceDesk = SecurityGroupSerializer(security)
                # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
                inServiceDesk = False
                for index, x in enumerate(userSecGroup.data):
                    if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                        inServiceDesk = True
                if(inServiceDesk or serializer.data['security_group'] == None):
                    return Response(serializer.data)
                if(serializer.data['security_group'] != None):
                    if(str(serializer.data['assignedTechId']) == str(user.id)):
                        return Response(serializer.data)
                    isTrue = False
                    # Loops through all security groups assigned to the user and checks if the security group assigned to the ticket is part of the groups
                    for index, x in enumerate(userSecGroup.data):
                        if str(serializer.data['security_group']) in str(userSecGroup.data[index]['securitygroup_id']):
                            isTrue = True
                    if (isTrue == True):
                        return Response(serializer.data)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
            if ((user.role_id == 3 and serializer.data['ticketOwnerSection'] == user.course_id_id) or serializer.data['ticketOwnerSection'] == None):
                return Response(serializer.data)
            if ((user.role_id == 4 and serializer.data['ticketOwnerSection'] == user.course_id_id and serializer.data['isAssigned'] == True) or str(user.id) == str(serializer.data['ticketOwnerId'])):
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)


class EditProblemViewSet(APIView):
    """ Gets a single problem based on role and allows editing based on roles and owner of ticket"""
    serializer_class = ProblemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        id = request.query_params['problemId']
        user = request.user
        # Grabs the security groups assigned to the current user
        userData = User_security_groups.objects.filter(user_id=user.id)
        userSecGroup = UserSecurityGroupSerializer(userData, many=True)
        if id != None:
            problem = Problem.objects.get(id=id)
            serializer = ProblemSerializer(problem)
            if user.role_id == 1:
                return Response(serializer.data)
            if user.role_id == 2:
                # Checks for the Service Desk within all security groups to compare
                security = SecurityGroup.objects.get(name="Service Desk")
                serviceDesk = SecurityGroupSerializer(security)
                # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
                inServiceDesk = False
                for index, x in enumerate(userSecGroup.data):
                    if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                        inServiceDesk = True
                if(str(serializer.data['assignedTechId']) == str(user.id)):
                    return Response(serializer.data)
                if(str(user.id) == str(serializer.data['ticketOwnerId'])):
                    return Response(serializer.data)
                # Asks if the user is part of the Service Desk Security group or if there isn't any security group on said ticket
                if(inServiceDesk or serializer.data['security_group'] == None):
                    return Response(serializer.data)
                if(serializer.data['security_group'] != None):
                    isTrue = False
                    # Loops through all security groups assigned to the user and checks if the security group assigned to the ticket is part of the groups
                    for index, x in enumerate(userSecGroup.data):
                        if str(serializer.data['security_group']) in str(userSecGroup.data[index]['securitygroup_id']):
                            isTrue = True
                    if (isTrue == True):
                        return Response(serializer.data)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

            if ((user.role_id == 3 and serializer.data['ticketOwnerSection'] == user.course_id_id) or serializer.data['ticketOwnerSection'] == None):
                return Response(serializer.data)
            if (user.role_id == 4 and (str(user.id) == str(serializer.data['ticketOwnerId']))):
                return Response(serializer.data)
            else:
                return Response(status=status.HTTP_401_UNAUTHORIZED)

    def put(self, request):
        """Updating a single problem, gets the problemId from request and updates said problem"""
        id = request.query_params['problemId']
        user = request.user
        # Grabs the security groups assigned to the current user
        userData = User_security_groups.objects.filter(user_id=user.id)
        userSecGroup = UserSecurityGroupSerializer(userData, many=True)
        if id != None:
            problem = Problem.objects.get(id=id)
            serializer = ProblemSerializer(problem)
            if user.role_id == 1:
                serializer = ProblemSerializer(problem, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            if user.role_id == 2:
                # Checks for the Service Desk within all security groups to compare
                security = SecurityGroup.objects.get(name="Service Desk")
                serviceDesk = SecurityGroupSerializer(security)
                # Loops through all security groups assigned to the user to find if the Service Desk is part of the groups
                inServiceDesk = False
                for index, x in enumerate(userSecGroup.data):
                    if(str(serviceDesk.data['securityGroupId']) in str(userSecGroup.data[index]['securitygroup_id'])):
                        inServiceDesk = True
                if(str(serializer.data['assignedTechId']) == str(user.id)):
                    serializer = ProblemSerializer(
                        problem, data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data)
                if(str(user.id) == str(serializer.data['ticketOwnerId'])):
                    serializer = ProblemSerializer(problem, data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data)
                if(inServiceDesk or serializer.data['security_group'] == None):
                    serializer = ProblemSerializer(problem, data=request.data)
                    if serializer.is_valid():
                        serializer.save()
                        return Response(serializer.data)
                if(serializer.data['security_group'] != None):
                    isTrue = False
                    # Loops through all security groups assigned to the user and checks if the security group assigned to the ticket is part of the groups
                    for index, x in enumerate(userSecGroup.data):
                        if str(serializer.data['security_group']) in str(userSecGroup.data[index]['securitygroup_id']):
                            isTrue = True
                    if (isTrue == True):
                        serializer = ProblemSerializer(
                            problem, data=request.data)
                        if serializer.is_valid():
                            serializer.save()
                            return Response(serializer.data)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
            if ((user.role_id == 3 and serializer.data['ticketOwnerSection'] == user.course_id_id) or serializer.data['ticketOwnerSection'] == None):
                serializer = ProblemSerializer(problem, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            if (user.role_id == 4 and str(user.id) == str(serializer.data['ticketOwnerId'])):
                serializer = ProblemSerializer(problem, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
