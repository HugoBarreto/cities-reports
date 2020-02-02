import os
import boto3
import json
import csv
import pandas as pd
from datetime import datetime as dt
from io import StringIO

s3 = boto3.client('s3')
lambd = boto3.client('lambda')

def get_payload(bucket, key):

    return s3.get_object(Bucket=bucket, Key=key)['Body'].read().decode('utf-8')

def get_file(bucket, key, read_function=lambda x: x):

    return read_function(get_payload(bucket, key))

def generate_new_row(bucket, key, query_name, today):

    query_df = pd.read_csv(get_file(bucket, key, StringIO))

    if query_name == 'ALERTS':
        dic = query_df.groupby('type').agg('count').uuid.to_dict()
        dic.update(query_df.groupby('subtype').agg('count').uuid.to_dict())

    return {'query': query_name, 'date': today.isoformat(), 'agg': dic}


def lambda_handler(event, context):

    today = dt.fromtimestamp(event['timestamp'])

    for query in event['queries']:
        row = generate_new_row(query['CSVBucket'],
                              query['CSVKey'],
                              query['query_name'],
                              today)

    agg = get_file(event['agg_file']['bucket'], event['agg_file']['key'], json.loads)
    agg.append(row)

    with open('/tmp/agg.json', 'w') as f:
        json.dump(agg, f)

    s3.upload_file('/tmp/agg.json',
                  Bucket=event['agg_file']['bucket'],
                  Key=event['agg_file']['key'],
                  ExtraArgs={'ACL': 'public-read'})
