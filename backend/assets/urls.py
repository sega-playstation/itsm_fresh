from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'asset-status-list', AssetStatusViewSet)
router.register(r"assets", AdminAssetViewSet)

general_router = DefaultRouter()
general_router.register(r"assets/section", GeneralAssetViewSet)

urlpatterns = [
    path("api/", include(general_router.urls)),
    path("api/", include(router.urls)),
]

<<<<<<< HEAD
urlpatterns += router.urls
=======
# urlpatterns += router.urls
>>>>>>> fde268c9814b79f49d05defa63c74f96c858c11b
