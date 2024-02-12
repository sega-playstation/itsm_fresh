from django.urls import include,path
from problems import views
from .views import ProblemViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'problemData', views.ProblemViewSet, basename='problemData')

urlpatterns = [
    path('api/problem/', views.ProblemAPIView.as_view(), name='problemView'),
    path('api/singleProblem/', views.SingleProblemViewSet.as_view(), name='singleProblem'),
    path('api/editProblem/', views.EditProblemViewSet.as_view(), name="editProblem"),
    path('api/', include(router.urls)),
]
urlpatterns += router.urls
