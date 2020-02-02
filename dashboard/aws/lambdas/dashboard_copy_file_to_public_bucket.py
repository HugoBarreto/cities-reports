import json
import boto3
from urllib import parse

s3 = boto3.client('s3')

def get_target_key(source_key):

    ### defining file key (prefix + filename)
    city, year, month, day, query = ['']*5
    for s in source_key.split('/'):
        city = s if 'city' in s else city
        year = s if 'year' in s else year
        month = s if 'month' in s else month
        day = s if 'day' in s else day
        query = s.split('=')[-1] if 'query' in s else query

    city = city.replace("ã", "a").replace(" ", "")

    prefix = '/'.join(map(lambda x: x.split('=')[-1].zfill(2), [year, month, day, city])) + '/'

    if source_key[-3:] == 'csv':
        name = query + '.csv'
    elif source_key[-3:] == 'pdf':
        name = source_key.split('/')[-1]

    return prefix + name


def lambda_handler(event, context):

    source_bucket = event['Records'][0]['s3']['bucket']['name']
    source_key = parse.unquote_plus(event['Records'][0]['s3']['object']['key'])
    copy_source = {'Bucket': source_bucket, 'Key': source_key}

    waiter = s3.get_waiter('object_exists')
    waiter.wait(Bucket=source_bucket, Key=source_key)

    target_bucket = 'hugo-data'
    target_key = get_target_key(source_key)

    ### coping files
    s3.copy_object(Bucket=target_bucket, Key=target_key,
                    CopySource=copy_source, ACL='public-read')
