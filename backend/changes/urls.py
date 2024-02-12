from django.urls import path, include
from changes import views
from .views import RequestAPIView, RequestAPIViewSet, RequestViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'requestData', RequestViewSet,
                basename="requestData")

urlpatterns = [
    path('api/requests/', RequestAPIView.as_view(), name='requestView'),
    path("api/singleRequest/", views.SingleRequestAPIView.as_view(), name="singleRequestView"),
    path("api/editRequest/<uuid:change_id>/", views.EditRequestAPIView.as_view(), name="editRequestView"),
    path('api/request/', RequestAPIViewSet.as_view(), name='singleRequest'),
    path('api/', include(router.urls)),
]

urlpatterns += router.urls