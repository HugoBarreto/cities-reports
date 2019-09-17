import json
import boto3
from datetime import datetime as dt
from datetime import timedelta as td
import time

lambd = boto3.client('lambda')
stepfunction = boto3.client('stepfunctions')
s3 = boto3.client('s3')

def read_response(response):

    return json.loads(response['Payload'].read().decode('utf-8'))
    
def lambda_handler(event, context):

    city = event['cities'][event['stepfunction']['city']]
        
    # Calls Athena for each query, sending it a task
    for query in city['queries']:
        # update Athena task
        city['task'] = query
        
        # calling Athena
        response = lambd.invoke(FunctionName='weekly-reports-query-athena',
                                Payload=json.dumps(city))
        
        # update city['queries'][query] information
        query.update(read_response(response))
        
    # Start Execution of weekly-reports State Machine, which will coordinate all the process of report generation from now on.
    timestamp = city['timestamp']
    today = dt.fromtimestamp(timestamp)
    
    stepfunction.start_execution(stateMachineArn = "arn:aws:states:us-east-2:697036326133:stateMachine:weekly-reports", 
                                 name= f"{''.join(city['city'].split())}-{today.year}-{today.month}-{today.day}-{int(timestamp)}",
                                 input= json.dumps(city))
    
    ### Testing purpose
    bucket = city['bucket']
    prefix = city['prefix']
    
    open('/tmp/city_config.json', 'w').write(json.dumps(city))
    s3.upload_file('/tmp/city_config.json', Bucket=bucket, Key= prefix + "stepfunction_input.json")
    
    #### Starter State Machine Variables
    sf_starter = event['stepfunction']
    
    sf_starter['city'] += 1
    sf_starter['done'] = True if sf_starter['city'] == sf_starter['totalCities'] else False    
    
    return sf_starter