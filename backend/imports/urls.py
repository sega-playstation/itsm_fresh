from rest_framework.routers import DefaultRouter
from django.urls import path, include
from imports import views
from .views import *
from django.contrib.auth import views as auth_views
from users import views

router = DefaultRouter()

# router.register(r'changePassword', views.ChangePasswordViewSet,
#                 basename='changePassword')

urlpatterns = [
    path('api/import/', UploadFileView.as_view(), name="uploadFileView"),
    # path('password-reset-confirm/<hashed_user_id>/<token>/', auth_views.PasswordResetConfirmView.as_view(), name='password_reset_confirm')
    
]

urlpatterns += router.urls