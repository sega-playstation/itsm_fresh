from email.mime import base
from django.urls import path, include
from priority import views
from priority.views import StatusViewSet, PriorityViewSet, StatusIncidentViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'status', views.StatusViewSet, basename='status')
router.register(r'priority', views.PriorityViewSet, basename='priority')
router.register(r'incidentStatus', views.StatusIncidentViewSet,
                basename='incidentStatus')
router.register(r'problemStatus', views.StatusProblemViewSet,
                basename='problemStatus')

urlpatterns = [
    path('api/', include(router.urls)),
]

urlpatterns += router.urls
