from email.mime import base
from django.urls import path, include
from incidents import views
from .views import IncidentViewSet, TicketTypeViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'incidentData', views.ViewIncidentViewSet,
                basename='incidentData')
router.register(r'tickettype', views.TicketTypeViewSet,
                basename='ticketType')


urlpatterns = [
    path('api/incident/', views.IncidentAPIView.as_view(), name="incidentView"),
    path('api/singleIncident/', views.IncidentViewSet.as_view(), name="singleIncident"),
    path('api/editIncident/', views.EditIncidentAPIView.as_view(), name="editIncident"),
    path('api/problemsRelated/', views.ProblemsRelatedView.as_view(),
         name="problemsRelated"),
    path('api/problemsRelatedRetrieve/', views.RetrieveRelatedProblems.as_view(),
         name="retrieveRelatedProblems"),
    path('api/', include(router.urls)),
]

urlpatterns += router.urls
