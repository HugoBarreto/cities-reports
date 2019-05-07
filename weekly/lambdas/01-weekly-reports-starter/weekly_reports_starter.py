import json
import boto3
from datetime import datetime as dt
from datetime import timedelta as td
import time

lambd = boto3.client('lambda')
stepfunction = boto3.client('stepfunctions')
s3 = boto3.client('s3')

def get_reports_config(bucket, key):
    
    s3 = boto3.client('s3')
    response = s3.get_object(Bucket=bucket, Key=key)
    payload = json.loads(response['Body'].read().decode('utf-8'))
    
    #payload['cities'] is a list of dicts where each one has the queries for one city
    return payload

def read_response(response):

    return json.loads(response['Payload'].read().decode('utf-8'))
    
def lambda_handler(event, context):
    
    timestamp = time.time()
    today = dt.fromtimestamp(timestamp)
    ### Caso a execução do lambda ocorra em qualquer dia da semana exceto domingo
    ### o lambda executará como se fosse no domingo anterior
    if today.isoweekday() != 7:
        today = today - td(days=today.isoweekday())
    
    bucket = 'waze-reports'
    
    testing = event.get('test', False)
    
    if not testing:
        key = 'weekly/support_files/reports_config.json'
    else:        
        key = 'weekly/support_files/rc_test.json' 
        
    reports_config = get_reports_config(bucket, key)
    
    total_cities = 0
    for city in reports_config['cities']:
        city['bucket'] = bucket
        if not testing:
            city['prefix'] = f"weekly/data/city={city['city']}/year={today.year}/month={today.month}/day={today.day}/"
        else:
            city['prefix'] = "test/report/"
        city['timestamp'] = timestamp
        total_cities += 1
    
    reports_config['stepfunction'] = {'totalCities': total_cities, 'city': 0, 'done': False}
    
    stepfunction.start_execution(
            stateMachineArn = "arn:aws:states:us-east-2:697036326133:stateMachine:weekly-reports-starter",
            name= f"{today.year}-{today.month}-{today.day}-{int(timestamp)}",
            input= json.dumps(reports_config)
            )
    
    