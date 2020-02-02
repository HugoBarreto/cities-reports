import json
import boto3
from datetime import datetime as dt
from datetime import timedelta as td
import time

stepfunction = boto3.client('stepfunctions')
s3 = boto3.client('s3')

def get_payload(bucket, key):

    return s3.get_object(Bucket=bucket, Key=key)['Body'].read().decode('utf-8')

def get_file(bucket, key, read_function=lambda x: x):

    return read_function(get_payload(bucket, key))

def lambda_handler(event, context):

    timestamp = time.time()
    today = dt.fromtimestamp(timestamp)
    ### Caso a execução do lambda ocorra em qualquer dia da semana exceto domingo
    ### o lambda executará como se fosse no domingo anterior
    if today.isoweekday() != 7:
        today = today - td(days=today.isoweekday())

    ### Here we're defining the Bucket where reports_config.json is stored
    bucket = 'waze-reports'

    testing = event.get('test', False)

    if not testing:
        key = 'dashboard/support_files/dashboard_config.json'
    else:
        key = 'dashboard/support_files/dash_test.json'

    dashboard_config = get_file(bucket, key, json.loads)

    total_cities = 0
    for city in dashboard_config['cities']:
        if not testing:
            city['prefix'] = \
              f"dashboard/data/city={city['city']}/year={today.year}/month={today.month}/day={today.day}/"
        else:
            city['prefix'] = "dashboard/test/"
        # Must get timestamp from today var in order to simulate sundays
        city['timestamp'] = dt.timestamp(today)
        total_cities += 1

    dashboard_config['stepfunction'] = {'totalCities': total_cities, 'city': 0, 'done': False}

    stepfunction.start_execution(
            stateMachineArn = "arn:aws:states:us-east-2:697036326133:stateMachine:dashboard-starter",
            name= f"{today.year}-{today.month}-{today.day}-{int(timestamp)}",
            input= json.dumps(dashboard_config))
