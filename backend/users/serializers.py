from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Course, Role, PasswordResetToken
from enum import Enum
class EnumField(serializers.Field):
    def to_representation(self, obj):
        if isinstance(obj, Enum):
            return obj.name
        return obj
class CourseSerializer(serializers.ModelSerializer):
    term = EnumField()
    class Meta:
        model = Course
        fields = ['id', 'name', 'term', 'year', 'section']

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ['id', 'roleId', 'name']
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role_id = serializers.IntegerField()
    role_name = serializers.ReadOnlyField(source="role.name")
    course_details = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = [ 'id', 'email', 'password', 'first_name', 'last_name', 'role_id', 'role_name', 'courseId', 'course_details', 'is_active', 'is_staff', 'date_joined' ]

    def get_course_details(self, user):
        course_ids = user.courseId
        if course_ids:
            courses = Course.objects.filter(id__in=course_ids)
            serializer = CourseSerializer(courses, many=True)
            return serializer.data
        else:
            return []

    def validate_courseId(self, value):
        # Checking if each courseId exists in the Course model
        for course_id in value:
            try:
                Course.objects.get(id=course_id)
            except Course.DoesNotExist:
                raise serializers.ValidationError(f"Course with id {course_id} does not exist.")
        return value

    def create(self, validated_data):
        requesting_user = self.context['request'].user

        if requesting_user.is_staff:
            role_id = validated_data.get('role_id', None)
        else:
            role_id = 4 # default role_id > Admin would control it

        if 'courseId' in validated_data:
            courseId_data = self.validate_courseId(validated_data['courseId'])
        else:
            courseId_data = []

        if role_id in [1, 3, 4]:  # 1 => admin, 3 => instructor, 4 => student
            if role_id == 1:
                courseId_data = None
            elif role_id in [3, 4]:
                if not courseId_data:
                    raise serializers.ValidationError("courseId data is required for role 3 or 4.")
                elif (role_id == 4 and len(courseId_data) == 1) or (role_id == 3 and len(courseId_data) >= 1):
                    pass  # Valid courseId data
                else:
                    raise serializers.ValidationError("Invalid courseId data for the given role.")
        else:
            raise serializers.ValidationError("Invalid role_id for setting courseId data.")

        user = super(UserSerializer, self).create(validated_data)
        user.role_id = role_id
        user.is_staff = role_id == 1
        user.courseId = courseId_data
        user.set_password(validated_data['password'])

        user.is_active = True if requesting_user.is_staff else False

        user.save()
        return user

    def update(self, instance, validated_data):
        requesting_user =  self.context['request'].user

        if requesting_user.is_staff:
            pass
        else:
            raise serializers.ValidationError("You are unauthorized to perform this action.")

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

            if attr == 'password':
                instance.set_password(value)

            if attr == 'role_id':
                if requesting_user.is_staff:
                    instance.is_staff = value == 1
                else:
                    raise serializers.ValidationError("Unauthorized for setting role_id data.")

        if 'is_staff' in  validated_data:
            if requesting_user.is_staff:
                is_staff_data = validated_data['is_staff']
                instance.is_staff = is_staff_data
            else:
                raise serializers.ValidationError("Unauthorized for setting is_staff data.")

        if 'courseId' in validated_data:
            if requesting_user.is_staff:
                pass
            else:
                raise serializers.ValidationError("Unauthorized for setting courseId data.")

            role_id = instance.role_id
            courseId_data = validated_data['courseId']
            courseId_data = self.validate_courseId(validated_data['courseId'])


            if role_id == 1:
                instance.courseId = []
            elif role_id in [3, 4]: # 3 => instructor, 4 => student
                if courseId_data:
                    if (role_id == 4 and len(courseId_data) == 1) or (role_id == 3 and len(courseId_data) >= 1):
                        instance.courseId = courseId_data
                    else:
                        raise serializers.ValidationError("Invalid number of courseId data provided for the given role.")
                else:
                    raise serializers.ValidationError("courseId data is required for role 3 or 4.")
            else:
                raise serializers.ValidationError("Invalid role_id for setting courseId data.")

        instance.save()
        return instance

class UserListSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role_name = serializers.ReadOnlyField(source="role.name")
    course_details = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = [ 'id','email', 'password', 'first_name', 'last_name', 'role_id', 'role_name','courseId', 'course_details']

    def get_course_details(self, user):
        course_ids = user.courseId
        if course_ids:
            courses = Course.objects.filter(id__in=course_ids)
            serializer = CourseSerializer(courses, many=True)
            return serializer.data
        else:
            return []

class PasswordResetRequestSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    class Meta:
        model = PasswordResetToken
        fields = ['email']

class PasswordResetSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    resetId= serializers.UUIDField()
    class Meta:
        model = get_user_model()
        fields = ['resetId', 'password']

class DetailedTokenPairSerializer(TokenObtainPairSerializer):
    def get_token(self, user):
        token = super().get_token(user)

        token['sub'] = {
            'email': user.email,
            'firstName': user.first_name,
            'lastName': user.last_name,
            'isActive': user.is_active,
            'isStaff': user.is_staff,
            'roleId': user.role_id,
            'courseId': [str(course) for course in user.courseId] if user.role_id != 1 else []
        }

        return token

class EmailSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    class Meta:
        model = get_user_model()
        fields = ['email']