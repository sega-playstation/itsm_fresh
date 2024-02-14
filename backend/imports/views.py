import pandas as pd
import os
import datetime
import uuid

from problems.models import Problem
from priority.models import *
from incidents.models import *
from users.models import *
from assets.models import *
from change.models import *
# from users.views import SendGridMailSender

from pathlib import Path
from django.urls import reverse
from django.test import RequestFactory
from zoneinfo import available_timezones, ZoneInfo
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.hashers import make_password

# All email related imports
from django.core.mail import send_mail
from django.urls import reverse
from rest_framework import status
from rest_framework.response import Response
import os
from django.db import transaction

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.conf import settings
from urllib.parse import urlparse


# View that handles all the imports of different data types.
# Pretty self explanatory as to what's going on.
class UploadFileView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        dataType = request.data.get("type")
        currentUserId = request.data.get("userId")
        currentUserSection = request.data.get("section")
        currentUserRole = request.data.get("roleId")
        exist_count = 0
        # Variable to count how many rows have been imported
        count = 0
        csv_file = request.FILES.get("file")
        origin_tz = ZoneInfo("Canada/Central")
        # I remember needing this before, but not sure anymore.
        # serializer = IncidentSerializer(many=True)
        if currentUserRole == "1" or currentUserRole == "3":
            if csv_file is None:
                return Response(
                    {"message": "Please choose a file."}, status.HTTP_400_BAD_REQUEST
                )
            else:
                reader = pd.read_csv(csv_file)
                if dataType not in csv_file.name:
                    response = Response(
                        {"message": "Please choose a file that matches the data type."},
                        status.HTTP_409_CONFLICT,
                    )
                # >>>>>>>>>>>>>>>>>INCIDENTS>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                if dataType == "Incident" and "Incident" in csv_file.name:
                    for _, row in reader.iterrows():
                        new_incident = Incident()
                        user = row["User"]

                        if User.objects.filter(username=row["User"]).exists():
                            new_incident.userId = User.objects.get(username=row["User"])
                        else:
                            return Response(
                                {
                                    "message": "The user '{user}' does not exist. Please try again.".format(
                                        user=user
                                    ),
                                    "field": "Field: User, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        inc_status = row["Status"]
                        if Status.objects.filter(status_name=row["Status"]).exists():
                            new_incident.status = Status.objects.get(
                                status_name=row["Status"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "{inc_status} does not exist. Please check your data.".format(
                                        inc_status=inc_status
                                    ),
                                    "field": "Field: Status, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        try:
                            date = str(
                                datetime.datetime.strptime(
                                    row["Date Reported"], "%Y-%m-%d %I:%M:%S %p"
                                )
                            )
                            new_incident.reportDateTime = (
                                datetime.datetime.fromisoformat(date).replace(
                                    tzinfo=origin_tz
                                )
                            )
                        except ValueError:
                            return Response(
                                {
                                    "message": "Invalid format on Date Reported, should be 'YYYY-MM-DD HH:MM:SS AM/PM'. *Hours should be in 12-hour format and not 24-hour format.* Try putting an apostrophe in the beginning of the date in your csv file.",
                                    "field": "Field: Date Reported, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        new_incident.multipleAffectedUser = row[
                            "Multiple Affected Users"
                        ]

                        if row["Multiple Affected Users"] is True:
                            if (
                                row["Affected User Size"] > 0
                                and row["Affected User Size"] <= 50
                            ):
                                new_incident.affectedUserSize = 1
                            elif (
                                row["Affected User Size"] > 50
                                and row["Affected User Size"] <= 100
                            ):
                                new_incident.affectedUserSize = 2
                            else:
                                new_incident.affectedUserSize = 3
                        else:
                            new_incident.affectedUserSize = 0

                        inc_impact = row["Impact"]
                        inc_urgency = row["Urgency"]
                        if Priority.objects.filter(priority_name=inc_impact).exists():
                            new_incident.impact = Priority.objects.get(
                                priority_name=inc_impact
                            )
                        else:
                            return Response(
                                {
                                    "message": "'{inc_impact}' is an invalid status. Please try again.".format(
                                        inc_impact=inc_impact
                                    ),
                                    "field": "Field: Impact, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        if Priority.objects.filter(priority_name=inc_urgency).exists():
                            new_incident.urgency = Priority.objects.get(
                                priority_name=row["Urgency"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "'{inc_urgency}' is an invalid status. Please try again.".format(
                                        inc_urgency=inc_urgency
                                    ),
                                    "field": "Field: Urgency, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        if row["Urgency"] == "Low":
                            new_incident.priority = Priority.objects.get(
                                priority_name="Low"
                            )
                        else:
                            if row["Urgency"] == "Medium":
                                if row["Impact"] != "Critical":
                                    new_incident.priority = Priority.objects.get(
                                        priority_name="Medium"
                                    )
                                else:
                                    new_incident.priority = Priority.objects.get(
                                        priority_name="High"
                                    )
                            else:
                                if row["Urgency"] == "High":
                                    if row["Impact"] == "Critical":
                                        new_incident.priority = Priority.objects.get(
                                            priority_name="Critical"
                                        )
                                    elif row["Impact"] == "Low":
                                        new_incident.priority = Priority.objects.get(
                                            priority_name="Medium"
                                        )
                                    else:
                                        new_incident.priority = Priority.objects.get(
                                            priority_name="High"
                                        )
                                else:
                                    if row["Urgency"] == "Critical":
                                        if (
                                            row["Impact"] == "Critical"
                                            or row["Impact"] == "High"
                                        ):
                                            new_incident.priority = (
                                                Priority.objects.get(
                                                    priority_name="Critical"
                                                )
                                            )
                                        else:
                                            new_incident.priority = (
                                                Priority.objects.get(
                                                    priority_name="High"
                                                )
                                            )

                        new_incident.ticketOwnerId = User.objects.get(id=currentUserId)

                        inc_assignedTech = row["Assigned Technician"]
                        if User.objects.filter(
                            username=row["Assigned Technician"], role=2
                        ).exists():
                            new_incident.assignedTechId = User.objects.get(
                                username=row["Assigned Technician"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "The user {inc_assignedTech} does not exist or is not a valid technician. Please try again.".format(
                                        inc_assignedTech=inc_assignedTech
                                    ),
                                    "field": "Field: Assigned Technician, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        if row["Assigned Technician"] is None:
                            new_incident.isAssigned = False
                        else:
                            new_incident.isAssigned = True

                        # ticketType = TicketType.objects.filter(type=row['Ticket Type']).first()
                        category_ticket = row["Ticket Type"].split("-")
                        print(category_ticket)

                        if len(category_ticket) != 2:
                            return Response(
                                {
                                    "message": "{ticket_type} is an invalid ticket type. Please try again.".format(
                                        ticket_type=row["Ticket Type"]
                                    ),
                                    "field": "Field: Ticket Type, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        category = category_ticket[0]
                        ticket_type = category_ticket[1]

                        try:
                            new_incident.ticketType = TicketType.objects.get(
                                category=category, type=ticket_type
                            )
                        except TicketType.DoesNotExist:
                            return Response(
                                {
                                    "message": "{ticket_type} is an invalid ticket type. Please try again.".format(
                                        ticket_type=ticket_type
                                    ),
                                    "field": "Field: Ticket Type, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        new_incident.subject = row["Subject"]
                        new_incident.details = row["Details"]

                        if currentUserRole != "1":
                            new_incident.ticketOwnerSection = Course.objects.get(
                                id=currentUserSection
                            )
                        new_incident.ticketOwnerRole = Role.objects.get(
                            roleId=currentUserRole
                        )

                        security_group = row["Security Group"]

                        if SecurityGroup.objects.filter(
                            name=row["Security Group"]
                        ).exists():
                            new_incident.security_group = SecurityGroup.objects.get(
                                name=row["Security Group"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "The security group '{security_group}' does not exist. Please try again.".format(
                                        security_group=security_group
                                    ),
                                    "field": "Field: Security Group, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        new_incident.save()
                        count = count + 1
                    return Response(
                        {
                            "message": "{count} incidents have been successfully imported.".format(
                                count=count
                            )
                        },
                        status.HTTP_201_CREATED,
                    )

                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>PROBLEM>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                if dataType == "Problem" and "Problem" in csv_file.name:
                    for _, row in reader.iterrows():
                        new_problem = Problem()
                        prob_user = row['User']
                        if User.objects.filter(username=row['User']).exists():
                            new_problem.userId = User.objects.get(username=row['User'])
                        else:
                            return Response({'message':"The user {prob_user} does not exist. Please try again.".format(prob_user=prob_user),
                                            "field":"Field: User, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)

                        prob_status = row['Status']
                        if Status.objects.filter(status_name=row['Status']).exists():
                            new_problem.status = Status.objects.get(status_name=row['Status'])
                        else:
                            return Response({"message":"{prob_status} does not exist. Please try again.".format(prob_status=prob_status),
                                            "field":"Field: Status, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)
                        try:
                            date = str(datetime.datetime.strptime(row['Date Reported'], "%Y-%m-%d %I:%M:%S %p"))
                            new_problem.reportDateTime = datetime.datetime.fromisoformat(date).replace(tzinfo=origin_tz)
                        except ValueError:
                            return Response({"message":"Invalid format on Date Reported, should be 'YYYY-MM-DD HH:MM:SS AM/PM'. *Hours should be in 12-hour format and not 24-hour format.* Try putting an apostrophe in the beginning of the date in your csv file.",
                                             "field":"Field: Date Reported, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)

                        # impact = Priority.objects.get(priority_name=row['Impact'])
                        impact_name = row['Impact']
                        urgency = priority_name=row['Urgency']
                        # if Priority.objects.filter(priority_name = impact).exists():
                        #     new_problem.impact = Priority.objects.get(priority_name=impact)
                        # else:
                        #     return Response({"message": "'{impact}' is an invalid value. Please try again.".format(impact=impact),
                        #                      "field":"Field: Impact, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)
                        if Priority.objects.filter(priority_name=impact_name).exists():
                            new_problem.impact = Priority.objects.get(priority_name=impact_name)
                        else:
                            return Response({"message": "'{impact}' is an invalid value. Please try again.".format(impact=impact_name),
                                            "field": "Field: Impact, Row: {count}".format(count=count + 2)}, status.HTTP_409_CONFLICT)

                        if Priority.objects.filter(priority_name = urgency).exists():
                            new_problem.urgency = Priority.objects.get(priority_name=urgency)
                        else:
                            return Response({"message": "'{urgency}' is an invalid value. Please try again.".format(urgency=urgency),
                                             "field":"Field: Urgency, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)

                        if row['Urgency'] == "Low":
                            new_problem.priority = Priority.objects.get(priority_name = "Low")
                        else:
                            if row['Urgency'] == "Medium":
                                if row['Impact'] != "Critical":
                                    new_problem.priority = Priority.objects.get(priority_name = "Medium")
                                else:
                                    new_problem.priority = Priority.objects.get(priority_name = "High")
                            else:
                                if row['Urgency'] == "High":
                                    if row['Impact'] == "Critical":
                                        new_problem.priority = Priority.objects.get(priority_name = "Critical")
                                    elif row['Impact'] == "Low":
                                        new_problem.priority = Priority.objects.get(priority_name = "Medium")
                                    else:
                                        new_problem.priority = Priority.objects.get(priority_name = "High")
                                else:
                                    if row['Urgency'] == "Critical":
                                        if row['Impact'] == "Critical" or row['Impact'] == "High":
                                            new_problem.priority = Priority.objects.get(priority_name = "Critical")
                                        else:
                                            new_problem.priority = Priority.objects.get(priority_name = "High")

                        new_problem.multipleAffectedUser = row['Multiple Affected Users']

                        if row['Multiple Affected Users'] is True:
                            if row['Affected User Size'] > 0 and row['Affected User Size'] <= 50:
                                new_problem.affectedUserSize = 1
                            elif row['Affected User Size'] > 50 and row['Affected User Size'] <= 100:
                                new_problem.affectedUserSize = 2
                            else:
                                new_problem.affectedUserSize = 3
                        else:
                            new_problem.affectedUserSize = 0

                        new_problem.ticketOwnerId = User.objects.get(id=currentUserId)

                        prob_assignedTech = row['Assigned Technician']
                        if User.objects.filter(username=row['Assigned Technician'], role=2).exists():
                            new_problem.assignedTechId = User.objects.get(username=row['Assigned Technician'])
                        else:
                            return Response({"message": "The user '{prob_assignedTech}' does not exist or is not a valid technician.".format(prob_assignedTech=prob_assignedTech),
                                            "field":"Field: Assigned Technician, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)

                        new_problem.summary = row['Summary']
                        new_problem.details = row['Details']

                        security_group = row['Security Group']
                        if SecurityGroup.objects.filter(name=security_group).exists():
                            new_problem.security_group = SecurityGroup.objects.get(name=row['Security Group'])
                        else:
                            return Response({"message":"The security group '{security_group}' does not exist. Please try again.".format(security_group=security_group),
                                            "field":"Field: Security Group, Row: {count}".format(count=count+2)}, status.HTTP_409_CONFLICT)
                        new_problem.save()
                        count = count + 1
                    return Response({"message": "{count} problems have been successfully imported.".format(count=count)}, status.HTTP_201_CREATED)

                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>USER IMPORT<<<<<<<<<<<

                if dataType == "User" and "User" in csv_file.name:
                    with transaction.atomic():
                        email_sent = []  # Initialize with a default value
                        count = 0
                        for _, row in reader.iterrows():
                            new_user = User()
                            exist_count += User.objects.filter(
                                username=row["Username"]
                            ).count()
                            import_username = row["Username"]
                            import_email = row["Email Address"]
                            if User.objects.filter(username=row["Username"]).exists():
                                return Response(
                                    {
                                        "message": "{import_username} already exists in the database.".format(
                                            import_username=import_username
                                        ),
                                        "field": "Field: Username, Row: {count}".format(
                                            count=count + 2
                                        ),
                                    },
                                    status.HTTP_409_CONFLICT,
                                )
                            else:
                                new_user.username = import_username
                            new_user.first_name = row["First Name"]
                            new_user.last_name = row["Last Name"]
                            new_user.password = make_password(str(row["Password"]))
                            if User.objects.filter(email=row["Email Address"]).exists():
                                return Response(
                                    {
                                        "message": "{import_email} already exists in the database.".format(
                                            import_email=import_email
                                        ),
                                        "field": "Field: Email Address, Row: {count}".format(
                                            count=count + 2
                                        ),
                                    },
                                    status.HTTP_409_CONFLICT,
                                )
                            else:
                                new_user.email = import_email
                            new_user.approved = True
                            role = row["Role"]
                            if pd.isna(role) or role.strip() == "":
                                return Response(
                                    {
                                        "message": "Role is missing. Please provide a valid role.",
                                        "field": "Field: Role, Row: {count}".format(
                                            count=count + 2
                                        ),
                                    },
                                    status.HTTP_400_BAD_REQUEST,
                                )
                            elif Role.objects.filter(name=role).exists():
                                new_user.role = Role.objects.get(name=role)
                            else:
                                return Response(
                                    {
                                        "message": "{role} does not exist. Please try again.".format(
                                            role=role
                                        ),
                                        "field": "Field: Role, Row: {count}".format(
                                            count=count + 2
                                        ),
                                    },
                                    status.HTTP_409_CONFLICT,
                                )

                            if User.objects.filter(username=row["Username"]).exists():
                                return Response(
                                    {
                                        "message": "{import_username} already exists in the database.".format(
                                            import_username=import_username
                                        ),
                                        "field": "Field: Username, Row: {count}".format(
                                            count=count + 2
                                        ),
                                    },
                                    status.HTTP_409_CONFLICT,
                                )
                            else:
                                new_user.username = import_username

                            section = row["Section"]
                            if Course.objects.filter(section=row["Section"]).exists():
                                new_user.course_id = Course.objects.get(
                                    section=row["Section"]
                                )
                            new_user.save()
                            hashed_user_id = urlsafe_base64_encode(
                                force_bytes(new_user.id)
                            )
                            count += 1

                            securityGroups = str(
                                row["Security Groups"]
                            )  # Convert the value to a string
                            if securityGroups:
                                securityGroups = securityGroups.split(",")
                            else:
                                securityGroups = []
                                if SecurityGroup.objects.filter(
                                    name=security_group
                                ).exists():
                                    new_user_secGroup.securitygroup_id = (
                                        SecurityGroup.objects.get(name=security_group)
                                    )
                                else:
                                    return Response(
                                        {
                                            "message": "{security_group} does not exist. Please try again.".format(
                                                security_group=security_group
                                            ),
                                            "field": "Field: Security Groups, Row: {count}".format(
                                                count=count + 2
                                            ),
                                        },
                                        status.HTTP_409_CONFLICT,
                                    )
                                new_user_secGroup.save()

                                sendGridURL = reverse("passwordResetRequest")

                            # Generate the password reset URL using the user's ID
                            hashed_user_id = urlsafe_base64_encode(
                                force_bytes(new_user.id)
                            )
                            token = PasswordResetTokenGenerator().make_token(new_user)

                            encrypted_user_data = reverse(
                                "password_reset_confirm",
                                kwargs={
                                    "hashed_user_id": hashed_user_id,
                                    "token": token,
                                },
                            )

                            # Get the current site domain dynamically
                            # Get the current site based on the incoming request's domain
                            current_domain = urlparse(
                                request.META["HTTP_REFERER"]
                            ).netloc
                            current_site = "default"  # Default to 'default' if the domain isn't found

                            for site, url in settings.SITE_URLS.items():
                                if current_domain == urlparse(url).netloc:
                                    current_site = site
                                    break
                            # Determine the site name based on the current site ID
                            # site_name = 'default' if current_site.id == 1 else f'site{current_site.id}'
                            # Use the SITE_URLS dictionary to get the correct site URL
                            site_url = settings.SITE_URLS[current_site]
                            # Construct the reset link dynamically using the site URL
                            reset_url = (
                                f"{site_url}/forget/password/{hashed_user_id}/{token}"
                            )

                            # email_sent = ""
                            import_email = row["Email Address"]
                            email_body = f"Your username is your academic email. Please reset your password by visiting the following link: {reset_url}"

                            try:
                                send_mail(
                                    "Reset Password",
                                    email_body,
                                    "pixellriver@aceproject.space",
                                    [import_email],
                                    fail_silently=False,
                                )
                                email_sent.append("success")
                            except Exception:
                                email_sent.append("fail")

                    return Response(
                        {
                            "message": "{count} users have been successfully imported.".format(
                                count=count
                            ),
                            "email_sent": email_sent,
                        },
                        status.HTTP_201_CREATED,
                    )

                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>ASSETS IMPORT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                if dataType == "Asset" and "Asset" in csv_file.name:
                    for _, row in reader.iterrows():
                        # License Information part of the Asset page
                        new_license = License()
                        new_license.vendor_name = row["Vendor"]
                        new_license.product_name = row["Product"]
                        new_license.current_version = row["Version"]
                        new_license.license_name = row["License Name"]
                        new_license.license_type = row["Type"]
                        new_license.vendor_support = row["Vendor Support?"]
                        new_license.license_cost = row["Cost"]
                        new_license.start_date = datetime.datetime.now()
                        new_license.end_date = datetime.datetime.now()
                        new_license.save()

                        # Asset Details part of the Asset page
                        new_asset = Asset()
                        new_asset.asset_name = row["Asset Name"]
                        new_asset.serial_number = row["Serial Number"]
                        new_asset.category = row["Category"]
                        new_asset.license_id = License.objects.get(id=new_license.id)

                        assignedTo = row["Assigned To"]
                        if User.objects.filter(username=assignedTo).exists():
                            new_asset.assignedTo = User.objects.get(
                                username=row["Assigned To"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "The user '{assignedTo}' does not exist. Please try again.".format(
                                        assignedTo=assignedTo
                                    ),
                                    "field": "Field: Assigned To, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        new_asset.ip_address = row["IP Address"]

                        owner = row["Owner"]
                        if User.objects.filter(username=owner).exists():
                            new_asset.user_id = User.objects.get(username=row["Owner"])
                        else:
                            return Response(
                                {
                                    "message": "The user '{owner}' does not exist. Please try again.".format(
                                        owner=owner
                                    ),
                                    "field": "Field: Owner, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        asset_status = row["Status"]
                        if Asset_Status.objects.filter(name=asset_status).exists():
                            new_asset.status = Asset_Status.objects.get(
                                name=row["Status"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "{asset_status} does not exist. Please try again.".format(
                                        asset_status=asset_status
                                    ),
                                    "field": "Field: Status, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        new_asset.location = row["Location"]
                        new_asset.asset_resources = row["Asset Resources"]
                        new_asset.description = row["Description"]

                        if currentUserRole != "1":
                            new_asset.course = Course.objects.get(id=currentUserSection)
                        new_asset.createdBy = User.objects.get(id=currentUserId)
                        new_asset.save()
                        count = count + 1
                    return Response(
                        {
                            "message": "{count} assets have been successfully imported.".format(
                                count=count
                            )
                        },
                        status.HTTP_201_CREATED,
                    )

                # >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>CHANGE REQUEST IMPORT<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                if dataType == "Change Request" and "Change" in csv_file.name:
                    for _, row in reader.iterrows():
                        # Back Out Plan Form
                        new_backoutplan = BackoutPlan()
                        new_backoutplan.description = row["Back-Out Plan"]
                        new_backoutplan.save()

                        # Install Plan Form
                        new_installPlan = InstallPlan()
                        new_installPlan.description = row["Install Plan"]
                        new_installPlan.save()

                        # Business Justification Form
                        new_businessData = BusinessJustification()
                        try:
                            start_date = str(
                                datetime.datetime.strptime(
                                    row["Start Date"], "%Y-%m-%d %I:%M:%S %p"
                                )
                            )
                            new_businessData.start_date = (
                                datetime.datetime.fromisoformat(start_date).replace(
                                    tzinfo=origin_tz
                                )
                            )
                        except ValueError:
                            return Response(
                                {
                                    "message": "Invalid format on Start Date, should be 'YYYY-MM-DD HH:MM:SS AM/PM'. *Hours should be in 12-hour format and not 24-hour format.* Try putting an apostrophe in the beginning of the date in your csv file.",
                                    "field": "Field: Start Date, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        try:
                            end_date = str(
                                datetime.datetime.strptime(
                                    row["End Date"], "%Y-%m-%d %I:%M:%S %p"
                                )
                            )
                            new_businessData.end_date = datetime.datetime.fromisoformat(
                                end_date
                            ).replace(tzinfo=origin_tz)
                        except ValueError:
                            return Response(
                                {
                                    "message": "Invalid format on End Date, should be 'YYYY-MM-DD HH:MM:SS AM/PM'. *Hours should be in 12-hour format and not 24-hour format.* Try putting an apostrophe in the beginning of the date in your csv file.",
                                    "field": "Field: End Date, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        new_businessData.purpose = row["What is the purpose?"]
                        new_businessData.need = row["Why is it needed?"]
                        new_businessData.duration = row[
                            "How long will it be in effect?"
                        ]
                        # new_businessData.accessibility = row['Accessibility']
                        new_businessData.save()

                        # Risk Assessment Form
                        # Just waiting for final values
                        new_riskAssessment = RiskAssesment()
                        impact = 0
                        urgency = 0
                        document_config = row.get("Documentation of Configuration")
                        if document_config is None or document_config == "":
                            return Response(
                                {
                                    "message": "Empty value for Document of Configuration field. Please provide a valid value.",
                                    "field": "Field: Document of Configuration, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_400_BAD_REQUEST,
                            )
                        if document_config == "Incomplete and out of date":
                            new_riskAssessment.doc_config = document_config
                            impact = 1
                        elif document_config == "Less than 50%":
                            new_riskAssessment.doc_config = document_config
                            impact = 2
                        elif document_config == "More than 50%":
                            new_riskAssessment.doc_config = document_config
                            impact = 3
                        elif document_config == "Complete and up to date":
                            new_riskAssessment.doc_config = document_config
                            impact = 4
                        else:
                            return Response(
                                {
                                    "message": "'{document_config}' is an invalid value. Please try again.".format(
                                        document_config=document_config
                                    ),
                                    "field": "Field: Document of Configuration, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        environment = row["Environment"]
                        if environment == "Production - Multiple Dependencies":
                            new_riskAssessment.enviroment = environment
                            urgency = 1
                        elif environment == "Production - No Dependencies":
                            new_riskAssessment.enviroment = environment
                            urgency = 2
                        elif environment == "Test Environment":
                            new_riskAssessment.enviroment = environment
                            urgency = 3
                        elif environment == "Information Only":
                            new_riskAssessment.enviroment = environment
                            urgency = 4
                        else:
                            return Response(
                                {
                                    "message": "'{environment}' is an invalid value. Please try again.".format(
                                        environment=environment
                                    ),
                                    "field": "Field: Environment, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        redundancy_value = row["Redundancy"]
                        if redundancy_value == "None Available":
                            new_riskAssessment.redundancy = (
                                redundancy_value + " (Individual Point of Failure)"
                            )
                        elif redundancy_value == "Manual Available":
                            new_riskAssessment.redundancy = (
                                redundancy_value + " (Requires Additonal Effort)"
                            )
                        elif redundancy_value == "Automated and Available":
                            new_riskAssessment.redundancy = redundancy_value
                        else:
                            return Response(
                                {
                                    "message": "'{redundancy_value}' is an invalid value. Please try again.".format(
                                        redundancy_value=redundancy_value
                                    ),
                                    "field": "Field: Redundancy, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        env_maturity = row["Environment Maturity"]
                        if env_maturity == "Environment Obsolete":
                            new_riskAssessment.enviroment_maturity = env_maturity
                        elif env_maturity == "Environment Somewhat Mature":
                            new_riskAssessment.enviroment_maturity = env_maturity
                        elif env_maturity == "Environment Mature/Maintained":
                            new_riskAssessment.enviroment_maturity = env_maturity
                        else:
                            return Response(
                                {
                                    "message": "'{env_maturity}' is an invalid value. Please try again.".format(
                                        env_maturity=env_maturity
                                    ),
                                    "field": "Field: Environment Maturity, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        implement_time = row["Time to Implement"]
                        if implement_time == "0m-30m":
                            new_riskAssessment.time_to_implement = implement_time
                        elif implement_time == "30m-1h":
                            new_riskAssessment.time_to_implement = implement_time
                        elif implement_time == "1h-4h":
                            new_riskAssessment.time_to_implement = implement_time
                        elif implement_time == "4h+":
                            new_riskAssessment.time_to_implement = implement_time
                        else:
                            return Response(
                                {
                                    "message": "'{implement_time}' is an invalid value. Please try again.".format(
                                        implement_time=implement_time
                                    ),
                                    "field": "Field: Time to Implement, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        history = row["Change History"]
                        if history == "Change has failed previously":
                            new_riskAssessment.change_history = history
                        elif history == "Change has not been completed before":
                            new_riskAssessment.change_history = history
                        elif (
                            history == "Change has been complete with errors previously"
                        ):
                            new_riskAssessment.change_history = history
                        elif (
                            history
                            == "Change has been completed successfully previously"
                        ):
                            new_riskAssessment.change_history = history
                        else:
                            return Response(
                                {
                                    "message": "'{history}' is an invalid value. Please try again.".format(
                                        history=history
                                    ),
                                    "field": "Field: Change History, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        window = row["Deployment Window"]
                        if window == "Inadequate Window":
                            new_riskAssessment.deployment_window = (
                                window + " to Implement/Backout"
                            )
                        elif window == "Adequate Window":
                            new_riskAssessment.deployment_window = (
                                window
                            ) = " to Implement/Backout"
                        else:
                            return Response(
                                {
                                    "message": "'{window}' is an invalid value. Please try again.".format(
                                        window=window
                                    ),
                                    "field": "Field: Deployment Window, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        num_of_staff = row["Number of Staff/Teams"]
                        if num_of_staff == "1 Staff":
                            new_riskAssessment.num_of_staff = num_of_staff
                        elif num_of_staff == "4+ Staff":
                            new_riskAssessment.num_of_staff = "4 or More Staff"
                        elif num_of_staff == "1 Service Team":
                            new_riskAssessment.num_of_staff = num_of_staff
                        elif num_of_staff == "1+ Service Team":
                            new_riskAssessment = "Multiple Service Teams Required"
                        else:
                            return Response(
                                {
                                    "message": "'{num_of_staff}' is an invalid value. Please try again.".format(
                                        num_of_staff=num_of_staff
                                    ),
                                    "field": "Field: Number of Staff/Teams, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        pre_testing = row["Pre-Production Testing"]
                        if pre_testing == "No Testing Completed":
                            new_riskAssessment.testing = pre_testing
                        elif pre_testing == "Some Testing Completed":
                            new_riskAssessment.testing = pre_testing
                        elif pre_testing == "Previously Tested Successfully":
                            new_riskAssessment.testing = pre_testing
                        elif pre_testing == "Unable to Test":
                            new_riskAssessment.testing = pre_testing
                        else:
                            return Response(
                                {
                                    "message": "'{pre_testing}' is an invalid value. Please try again.".format(
                                        pre_testing=pre_testing
                                    ),
                                    "field": "Field: Pre-Production Testing, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        backout = row["Backout Plan"]
                        if backout == "Low Difficulty":
                            new_riskAssessment.backout_plan = backout
                        elif backout == "Medium Difficulty":
                            new_riskAssessment.backout_plan = backout
                        elif backout == "High Difficulty":
                            new_riskAssessment.backout_plan = backout
                        elif backout == "Not Possible":
                            new_riskAssessment.backout_plan = backout
                        else:
                            return Response(
                                {
                                    "message": "'{backout}' is an invalid value. Please try agian.".format(
                                        backout=backout
                                    ),
                                    "field": "Field: Backout Plan, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        schedule = row["Change Scheduling"]
                        if schedule == "Pre-Planned Maintenance Window":
                            new_riskAssessment.scheduling = schedule
                        elif schedule == "After-Hours, Non-Production":
                            new_riskAssessment.scheduling = schedule
                        elif schedule == "During Production, at request of Client":
                            new_riskAssessment.scheduling = schedule
                        elif schedule == "During Production":
                            new_riskAssessment.scheduling = schedule
                        elif schedule == "During Peak Time or Blackout Time":
                            new_riskAssessment.scheduling = schedule
                        else:
                            return Response(
                                {
                                    "message": "'{schedule}' is an invalid value. Please try again.".format(
                                        schedule=schedule
                                    ),
                                    "field": "Field: Change Scheduling, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        new_riskAssessment.save()

                        # Change Request Form
                        new_change = ChangeRequest()
                        new_change.requestType = row["Request Type"]

                        try:
                            date = str(
                                datetime.datetime.strptime(
                                    row["Date Requested"], "%Y-%m-%d %I:%M:%S %p"
                                )
                            )
                            new_change.requestDateTime = (
                                datetime.datetime.fromisoformat(date).replace(
                                    tzinfo=origin_tz
                                )
                            )
                        except ValueError:
                            return Response(
                                {
                                    "message": "Invalid format on Date Requested, should be 'YYYY-MM-DD HH:MM:SS AM/PM'. *Hours should be in 12-hour format and not 24-hour format.* Try putting an apostrophe in the beginning of the date in your csv file.",
                                    "field": "Field: Date Requested, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )

                        new_change.requestName = row["Request Name"]
                        new_change.projectName = row["Project Name"]

                        assignedTo = row["Assigned To"]
                        if User.objects.filter(username=assignedTo).exists():
                            new_change.assignedTo = User.objects.get(
                                username=row["Assigned To"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "The user '{assignedTo}' does not exist. Please try again.".format(
                                        assignedTo=assignedTo
                                    ),
                                    "field": "Field: Assigned To, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        new_change.ownerId = User.objects.get(id=currentUserId)
                        if currentUserRole != "1":
                            new_change.requestOwnerSection = Course.objects.get(
                                id=currentUserSection
                            )
                        new_change.department = row["Department"]

                        requested_by = row["Requested By"]
                        if User.objects.filter(username=requested_by).exists():
                            new_change.requestedById = User.objects.get(
                                username=row["Requested By"]
                            )
                        else:
                            return Response(
                                {
                                    "message": "The user '{requested_by}' does not exist. Please try again.".format(
                                        requested_by=requested_by
                                    ),
                                    "field": "Field: Requested By, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        new_change.requestContact = row["Contact"]
                        new_change.description = row["Description"]
                        new_change.backout_plan = BackoutPlan.objects.get(
                            id=new_backoutplan.id
                        )
                        new_change.install_plan = InstallPlan.objects.get(
                            id=new_installPlan.id
                        )
                        new_change.risk_assesment = RiskAssesment.objects.get(
                            id=new_riskAssessment.id
                        )
                        new_change.business_justification = (
                            BusinessJustification.objects.get(id=new_businessData.id)
                        )
                        new_change.impact = Priority.objects.get(priority_id=impact)
                        new_change.urgency = Priority.objects.get(priority_id=urgency)

                        if urgency == 4:
                            new_change.priority = Priority.objects.get(
                                priority_name="Low"
                            )
                        else:
                            if urgency == 3:
                                if impact != 1:
                                    new_change.priority = Priority.objects.get(
                                        priority_name="Medium"
                                    )
                                else:
                                    new_change.priority = Priority.objects.get(
                                        priority_name="High"
                                    )
                            else:
                                if urgency == 2:
                                    if impact == 1:
                                        new_change.priority = Priority.objects.get(
                                            priority_name="Critical"
                                        )
                                    elif impact == 4:
                                        new_change.priority = Priority.objects.get(
                                            priority_name="Medium"
                                        )
                                    else:
                                        new_change.priority = Priority.objects.get(
                                            priority_name="High"
                                        )
                                else:
                                    if urgency == 1:
                                        if impact == 1 or impact == 2:
                                            new_change.priority = Priority.objects.get(
                                                priority_name="Critical"
                                            )
                                        else:
                                            new_change.priority = Priority.objects.get(
                                                priority_name="High"
                                            )
                        asset_name = row["Related Asset"]
                        if Asset.objects.filter(
                            asset_name=row["Related Asset"]
                        ).exists():
                            temp = []
                            relatedAssets = Asset.objects.filter(
                                asset_name=row["Related Asset"]
                            )
                            for asset in relatedAssets:
                                temp.append(str(asset.id))
                                new_change.assets = temp
                        else:
                            return Response(
                                {
                                    "message": "{asset_name} does not exist. Please try again.".format(
                                        asset_name=asset_name
                                    ),
                                    "field": "Field: Related Asset, Row: {count}".format(
                                        count=count + 2
                                    ),
                                },
                                status.HTTP_409_CONFLICT,
                            )
                        new_change.save()
                        count = count + 1
                    return Response(
                        {
                            "message": "{count} change requests have been successfully imported.".format(
                                count=count
                            )
                        },
                        status.HTTP_201_CREATED,
                    )
                return response
        else:
            return Response(
                {
                    "message": "Access Denied.",
                    "content": "Only Admins and Instructors allowed.",
                },
                status.HTTP_401_UNAUTHORIZED,
            )
