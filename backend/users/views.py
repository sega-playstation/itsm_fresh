from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, permissions,status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Course, Role, PasswordResetToken
from .serializers import * 
from .utils import send_password_reset_email, get_client_ip
from core.settings import SITE_ID, SITE_URLS, DEFAULT_FROM_EMAIL, SENDGRID_API_KEY
import json

class UserViewSet(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
            
        if user.is_staff:
            return super().get_queryset()
        else:
            return get_user_model().objects.none()
        
class LimitedUserListView(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.is_staff:
            return super().get_queryset()
        elif user.role_id in [3, 4]:
            if user.role_id == 3:
                courses = self.kwargs.get('course_id')
                if courses:
                    return get_user_model().objects.filter(courseId__contains=[courses])
                else:
                    courses = user.courseId  
                    return get_user_model().objects.filter(courseId__overlap=courses)
            else:
                return get_user_model().objects.filter(courseId__contains=user.courseId)
        else:
            return get_user_model().objects.none()
        
class AccountAprovalView(APIView):
    def post(self, request, user_id):
        try:
            user = get_user_model().objects.get(id=user_id)
        except get_user_model().DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        request_body = json.loads(request.body.decode('utf-8'))
        
        sender = DEFAULT_FROM_EMAIL
        receiver = user.email

        if request_body['response'] == 'accept':
            user.is_active = True
            user.save()
            
            sub = "Acceptance on your itsm.ca account request."
            email_content = "Hi, your account request has been accepted."
                          
            if send_password_reset_email(sender, receiver, sub, email_content, SENDGRID_API_KEY):         
                return Response({"success": "Acceptance email sent successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Acceptance email failed to sent!"}, status=status.HTTP_403_FORBIDDEN)
        elif request_body['response'] == 'reject':

            user.delete()
            
            sub = "Rejection on your itsm.ca account request."
            email_content = "Hi, your account request has been rejected."
                    
            if send_password_reset_email(sender, receiver, sub, email_content, SENDGRID_API_KEY):         
                return Response({"success": "Rejection email sent successfully!"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "Rejection email failed to sent!"}, status=status.HTTP_403_FORBIDDEN)
        else:
            return Response({'message': 'Invalid response parameter'}, status=status.HTTP_400_BAD_REQUEST)

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAdminUser]
    
class CourseUserListViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [permissions.AllowAny]
    
class RoleViewSet(viewsets.ModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.IsAdminUser]
class RoleUserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Role.objects.all()
    serializer_class = RoleSerializer
    permission_classes = [permissions.AllowAny]

class RequestResetPasswordView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = get_user_model().objects.get(email__iexact=email)
                expiry_date = timezone.now() + timezone.timedelta(hours=1)

                # Client's IP address
                ip_address = get_client_ip(request)

                if ip_address is not None:
                    token = PasswordResetToken.objects.create(user=user, ip_address=ip_address, expiry_date=expiry_date)
                    
                    # SendGrid Email
                    reset_token = token.id
                    reset_link = SITE_URLS[SITE_ID] + '/auth/reset/' + str(reset_token) + '/'
                    
                    sender = DEFAULT_FROM_EMAIL
                    receiver = email
                    sub = "Password reset link for your itsm.ca account."
                    email_content = "Hi, please click the link below to reset your password" + " - " + reset_link
                    
                    
                    if send_password_reset_email(sender, receiver, sub, email_content, SENDGRID_API_KEY):
                        return Response({"success": "Email sent successfully!"}, status=status.HTTP_200_OK)
                    else:
                        token.delete()
                        return Response({"error": "Email failed to sent!"}, status=status.HTTP_403_FORBIDDEN)
                else:
                    return Response("IP address is empty or not provided.", status=status.HTTP_400_BAD_REQUEST)
            except ObjectDoesNotExist:
                return Response("User not found.", status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasswordResetView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        reset_id = serializer.validated_data['resetId']
        new_password = serializer.validated_data['password']

        try:
            token = PasswordResetToken.objects.get(id=reset_id)
        except ObjectDoesNotExist:
            return Response({"error": "Invalid resetId."}, status=status.HTTP_404_NOT_FOUND)
        
        if token.is_expired():
            token.delete()
            return Response({"error": "Password reset link has expired."}, status=status.HTTP_403_FORBIDDEN)

        client_ip = get_client_ip(request)
        if token.ip_address != client_ip:
            token.delete()
            return Response({"error": "IP address mismatch."}, status=status.HTTP_403_FORBIDDEN)

        user = token.user
        user.set_password(new_password)
        user.save()

        token.delete()

        return Response({"success": "Password reset successful."}, status=status.HTTP_200_OK)

class UnapprovedUserListView(viewsets.ModelViewSet):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
            
        if user.is_staff:
            return super().get_queryset().filter(is_active=False)
        else:
            return get_user_model().objects.none()
        
class CreateUserView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    
class EmailCheckerView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = EmailSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            user_exists = get_user_model().objects.filter(email__iexact=email).exists()

            if user_exists:
                return Response({"message": "Email is already being used."}, status=status.HTTP_406_NOT_ACCEPTABLE)
            else:
                return Response({"message": "Email is unique."}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)