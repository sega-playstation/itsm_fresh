import os
import django
from datetime import datetime

# Setting up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now we can import the models
from change.models import ChangeRequest

# Function to insert a new ChangeRequest
def insert_change_request():
    change_request = ChangeRequest(
        request_type="Update",
        ticket_number="TICKET12345",
        request_name="Sample Change Request",
        # Assuming the foreign keys are commented out or handled accordingly
        impact_slider=1,
        urgency_slider=2,
        priority_slider=3,
        new_change_data_sheet="This is a new change.",
        recovery_available=True,
        redundancy="None",
        change_history="Initial request",
        testing_completed=False,
        testing_desc="Testing pending",
        choose_environment="Development",
        are_there_dependencies=False,
        # Handle ManyToMany fields after save if necessary
        current_environment_maturity="Mature",
        documentation_of_config="Documented",
        adequate_install_window=True,
        required_employees="3",
        install_desc="Installation process...",
        adequate_backout_window=True,
        backout_difficulty="Low",
        backout_desc="Standard procedure",
        start_date=datetime.now(),
        perm_or_temp=True,
        time_to_implement="2 weeks",
        business_case_desc="Business justification..."
    )
    change_request.save()
    print(f"Inserted Change Request with ID: {change_request.id}")

if __name__ == "__main__":
    insert_change_request()
