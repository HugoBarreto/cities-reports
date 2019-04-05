import json
import os
import boto3
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

s3 = boto3.client('s3')
ses = boto3.client('ses', region_name='us-east-1')

def get_file(bucket, key):
    
    response = s3.get_object(Bucket=bucket, Key=key)
    payload = response['Body']
    
    return payload

def create_multipart_message(sender: str, recipients: list, title: str, text: str=None, html: str=None, attachments: list=None) -> MIMEMultipart:
    """
    Creates a MIME multipart message object.
    Uses only the Python `email` standard library.
    Emails, both sender and recipients, can be just the email string or have the format 'The Name <the_email@host.com>'.

    :param sender: The sender.
    :param recipients: List of recipients. Needs to be a list, even if only one recipient.
    :param title: The title of the email.
    :param text: The text version of the email body (optional).
    :param html: The html version of the email body (optional).
    :param attachments: List of files to attach in the email.
    :return: A `MIMEMultipart` to be used to send the email.
    """
    multipart_content_subtype = 'alternative' if text and html else 'mixed'
    msg = MIMEMultipart(multipart_content_subtype)
    msg['Subject'] = title
    msg['From'] = sender
    msg['To'] = ', '.join(recipients)

    # Record the MIME types of both parts - text/plain and text/html.
    # According to RFC 2046, the last part of a multipart message, in this case the HTML message, is best and preferred.
    if text:
        part = MIMEText(text, 'plain')
        msg.attach(part)
    if html:
        part = MIMEText(html, 'html')
        msg.attach(part)

    # Add attachments
    for attachment in attachments or []:
        f = get_file(*attachment)
        part = MIMEApplication(f.read())
        part.add_header('Content-Disposition', 'attachment', filename=('utf-8', None, os.path.basename(attachment[1])))
        msg.attach(part)            

    return msg


def send_mail(sender: str, recipients: list, title: str, text: str=None, html: str=None, attachments: list=None, **kwargs) -> dict:
    """
    Send email to recipients. Sends one mail to all recipients.
    The sender needs to be a verified email in SES.
    """
    
    msg = create_multipart_message(sender, recipients, title, text, html, attachments)
    return ses.send_raw_email(
        Source=sender,
        Destinations=recipients,
        RawMessage={'Data': msg.as_string()}
    )



def lambda_handler(event, context):
    
    bucket = 'waze-reports'
    key = 'test/test.pdf'
    
    email_config = event['email']
    
    response = send_mail(**email_config)
    print(response)
    
    