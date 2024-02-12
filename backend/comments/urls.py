from django.urls import path, include
from comments import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'comments', views.CommentViewSet, basename='comments')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/commentId/', views.CommentFilterViewSet.as_view(), name="singleComment"),
]
