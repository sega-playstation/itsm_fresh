from django.urls import path, include
from slas import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"slaData", views.SLAViewSet, basename="slaData")
router.register(r"sla_status", views.StatusViewSet, basename="sla_status")

urlpatterns = [
    path("api/sla/", views.SLAAPIView.as_view(), name="slaView"),
    path("api/singleSLA/", views.SingleSLAAPIView.as_view(), name="singleSLAView"),
    path("api/postSLA/", views.PostSLAAPIView.as_view(), name="postSLAView"),
    path(
        "api/editSLA/<uuid:sla_id>/", views.EditSLAAPIView.as_view(), name="editSLAView"
    ),
    path("api/", include(router.urls)),
]

urlpatterns += router.urls
