from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from backend.serviceGroup import views

router = DefaultRouter()
router.register("serviceGroup", views.ServiceGroupViewSet)
router.register("technicians", views.TechniciansViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]