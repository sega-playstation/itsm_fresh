from django.shortcuts import render
from rest_framework.response import Response
from .models import Status, Priority
from .serializers import StatusSerializer, PrioritySerializer
from rest_framework import viewsets
from rest_framework import permissions
from rest_framework.views import APIView
from django.db.models import Q
# Create your views here.


class StatusViewSet(viewsets.ModelViewSet):
    serializer_class = StatusSerializer
    queryset = Status.objects.order_by('status_id')


class PriorityViewSet(viewsets.ModelViewSet):
    serializer_class = PrioritySerializer
    queryset = Priority.objects.order_by('priority_id')
    #queryset = Priority.objects.all()


class StatusIncidentViewSet(viewsets.ModelViewSet):
    """Incident status required Open, Pending, Work In Progress, Resolved and Closed
        This is just asking for the specific values
        """
    serializer_class = StatusSerializer
    queryset = Status.objects.filter(Q(status_id=1) | Q(
        status_id=2) | Q(status_id=6) | Q(status_id=7) | Q(status_id=8)).order_by('status_id')


class StatusProblemViewSet(viewsets.ModelViewSet):
    """Problems on the other hand required every other status in the table except Work in Progress which is sort of replaced by Work Around"""
    serializer_class = StatusSerializer
    queryset = Status.objects.exclude(Q(status_id=9) | Q(status_id=10)).order_by('status_id')
