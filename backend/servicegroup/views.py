from django.shortcuts import render
from drf_spectacular.utils import extend_schema
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import viewsets, status, permissions

from .models import ServiceGroup, Technicians
from .serializers import ServiceGroupSerializer, TechniciansSerializer



# Create your views here.
class ServiceGroupViewSet(viewsets.ViewSet):
    queryset = ServiceGroup.objects.all()

    @extend_schema(responses = ServiceGroupSerializer)
    def get_ServiceGroupList(self):
        serializer = ServiceGroupSerializer(self.queryset, many=True)
        return Response(serializer.data)
    
class TechniciansViewSet(viewsets.ViewSet):
    queryset = Technicians.objects.all()

    @extend_schema(Response = TechniciansSerializer)
    def get_TechnicianList(self):
        serializer = TechniciansSerializer(self.queryset, many=True)
        return Response(serializer.data)
