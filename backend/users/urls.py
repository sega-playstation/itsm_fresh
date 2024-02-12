from django.urls import include, path
from rest_framework import routers
from .views import *



router = routers.DefaultRouter()

router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'courses-list', CourseUserListViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'roles-list', RoleUserViewSet)

urlpatterns = [
     path('api/', include(router.urls)),
     path('api/limited_users/classlist/', LimitedUserListView.as_view({'get': 'list'})),
     path('api/limited_users/classlist/<uuid:course_id>/', LimitedUserListView.as_view({'get': 'list'})),
     path('api/account_approval/<uuid:user_id>/', AccountAprovalView.as_view()),
     path('api/forget_password/', RequestResetPasswordView.as_view()),
     path('api/reset_password/', PasswordResetView.as_view()),
     path('api/unapproved_users/',UnapprovedUserListView.as_view({'get': 'list'})),
     path('api/create_account/', CreateUserView.as_view()),
     path('api/check_email/',EmailCheckerView.as_view())
]

urlpatterns += router.urls
