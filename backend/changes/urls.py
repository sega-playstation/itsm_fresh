from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views  # Make sure this imports your ChangeRequestViewSet

router = DefaultRouter()
router.register("changes", views.ChangeRequestViewSet)  # Adjust the name and viewset as necessary

urlpatterns = [
    path('api/', include(router.urls)),
]
