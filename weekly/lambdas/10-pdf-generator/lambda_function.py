# coding=utf-8
from weasyprint import HTML
from PIL import Image
from io import BytesIO
import boto3
import os
import json

s3 = boto3.client('s3')
lambd = boto3.client('lambda')

def get_file(bucket, key):
    
    response = s3.get_object(Bucket=bucket, Key=key)
    content = response['Body'].read().decode('utf-8')
    
    return content

def load_stylesheets(bucket, keys):
    
    if not os.path.exists("/tmp/css"):
        os.makedirs("/tmp/css")
    
    csss = []
    for i, key in enumerate(keys):
        css = get_file(bucket, key)
        
        csss.append('/tmp/css/' + str(i))
        
        open('/tmp/css/' + str(i), 'w').write(css)             
        
    return csss

def load_img(bucket, key, alert, size=None):

    # create dir, if it does not exist
    if not os.path.exists("/tmp/img"):
        os.makedirs("/tmp/img")
    
    response = s3.get_object(Bucket=bucket, Key=key)['Body']
    img = Image.open(BytesIO(response.read()))
    if size:
        img.thumbnail(tuple(size))
    
    img.save('/tmp/img/' + alert + '.png')
    
def load_all_imgs(img_files, bucket, size=None):
    
    for file in img_files:
        load_img(bucket, file['png_key'], file['alert'], size)
    
def convert_to_pdf_and_save(html, bucket, key, stylesheets):
    
    HTML(string=html).write_pdf('/tmp/the.pdf', stylesheets=stylesheets)
    
    s3.upload_file('/tmp/the.pdf', Bucket=bucket, Key=key)

def lambda_handler(event, context):
    
    bucket = event['bucket']
    
    #load html string
    html = get_file(event['report']['html']['html_out']['bucket'], event['report']['html']['html_out']['key'])
    
    #load images
    load_all_imgs(img_files=event['report']['img']['files'], bucket=event['report']['img']['bucket'], size=event['report']['img']['heatmap_config']['img_size'])
    
    #load stylesheets
    stylesheets = load_stylesheets(event['report']['css']['bucket'], event['report']['css']['keys'])
    load_img(bucket=event['report']['img']['bucket'], key=event['report']['img']['cover'], alert='background-homepage')
    os.rename('/tmp/img/background-homepage.png', '/tmp/css/background-homepage.png')

    #generate pdf and save on s3
    convert_to_pdf_and_save(html, event['report']['pdf']['bucket'], event['report']['pdf']['key'], stylesheets)
    
    #invoking send-email lambda
    event['email']['attachments'].append((event['report']['pdf']['bucket'], event['report']['pdf']['key']))
    
    lambd.invoke(
        FunctionName='send-email',
        InvocationType='Event',
        Payload=json.dumps(event))
    
        
# event = {'html': html_out,
#          'css': {'bucket': bckt,
#                  'keys': [key1, key2, ...]},
#          'pdf': {'bucket': bckt,
#                  'key': key}}