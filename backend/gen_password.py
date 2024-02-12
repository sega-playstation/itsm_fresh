from django.contrib.auth.hashers import make_password
import os
import django

# Set the DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

plaintext_password = "Student123!"
print(make_password(plaintext_password))

# Admin -> MyPassword123! 
# Instructors -> Instructor123!
# Students -> Student123!