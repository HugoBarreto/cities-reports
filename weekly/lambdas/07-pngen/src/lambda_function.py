ximport time
import boto3
import os

from webdriver_wrapper import WebDriverWrapper

s3 = boto3.client('s3')

def get_file(bucket, key):
    
    response = s3.get_object(Bucket=bucket, Key=key)
    content = response['Body'].read().decode('utf-8')
    
    return content

def get_html(bucket, key):
    open('/tmp/heatmap.html', 'w').write(get_file(bucket, key))
    return 'file:///tmp/heatmap.html'

def lambda_handler(event, context):
    driver = WebDriverWrapper()
    
    bucket = event['bucket']
    
    html_key = event['task']['html_key']
    #dataset_key = event['task']['dataset_key']
    #config_key = event['task']['config_key']
    png_key = event['task']['png_key']
    
    #open('/tmp/datasets.js', 'w').write(get_file(bucket, dataset_key))
    #open('/tmp/mapConfig.js', 'w').write(get_file(bucket, config_key))
    driver.get_url(get_html(bucket, html_key))
    time.sleep(15)
    driver.get_screenshot_as_file('/tmp/heatmap.png')

    print(driver._driver.capabilities)
    
    s3.upload_file('/tmp/heatmap.png', Bucket=bucket, Key=png_key)
    
    driver.close()
