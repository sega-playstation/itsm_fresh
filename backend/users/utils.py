from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import *

def send_password_reset_email(email_sender, email_receiver, subject_text, content_text, api_key):
    from_email = Email(email_sender)
    to_email = To(email_receiver)
    subject = subject_text
    content = Content("text/plain",content_text)
    mail = Mail(from_email, to_email, subject, content)

    sg = SendGridAPIClient(api_key)
    try:
        response = sg.client.mail.send.post(request_body=mail.get())
    except:
        print('SendGrid request failed')
        return False
    else:
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return response.status_code == 202

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip if ip else None
