import json
import boto3
import datetime
from datetime import datetime as dt
from datetime import timedelta as td

# athena constant
s3 = boto3.client('s3')
athena = boto3.client('athena')

def get_payload(bucket, key):
    
    return s3.get_object(Bucket=bucket, Key=key)['Body'].read().decode('utf-8')

def get_file(bucket, key, read_function=lambda x: x):
    
    return read_function(get_payload(bucket, key))

def daterange(start_date, end_date):
    for n in range(int ((end_date - start_date).days)):
        yield start_date + td(n)

def date_filter(start_date: datetime.date, end_date: datetime.date, hour_interval: tuple=(0,23)) -> str:
    '''(datetime.date, datetime.date, tuple(int, int)) -> list(tuple)
    
    Return a string which is a sql date conditional for data partioned by year, month, day and hour. 
    It filters data from start_date to end_date (not inclusive) in the specified hour_interval.
    
    '''
    return 'OR '.join(
        [f"(year={d.year} AND month={d.month} AND day={d.day} AND hour BETWEEN {hour_interval[0]} AND {hour_interval[1]})\n" + " "*18 
        for d in daterange(start_date, end_date)]).rstrip()

def get_query(event, today):
    
    # Target query template's Bucket and Key
    bucket = event['task']['bucket']
    key = event['task']['key']    
    
    # Get query template and format it
    return get_file(bucket, key).format(city=event['city'], date_filter=date_filter(today - td(days=7), today), 
                                                      table=event['task']['table'],
                                                      limit=event['task']['params']['limit'])        

def lambda_handler(event, context):
    
    #params extracted from execution
    today = dt.fromtimestamp(event['timestamp'])
    
    # S3 constant
    bucket = event['bucket']
    query_prefix = event['prefix'] + f"query_name={event['task']['query_name']}/"
    S3_OUTPUT = "s3://" + bucket +  "/" + query_prefix

    # get formatted query
    query = get_query(event, today)
    
    # DATABASE where the tables are
    DATABASE = event['task']['database']

    # Execution
    response = athena.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DATABASE},
        ResultConfiguration={'OutputLocation': S3_OUTPUT},
        WorkGroup='AutomaticReports')
    
    # Return query info to weekly_reports_caller that will be passed to State Machine to keep track of queries and theirs outputs
    payload = {'CSVBucket': bucket, "CSVKey": query_prefix + response['QueryExecutionId'] + ".csv",
               'QueryExecutionId': response['QueryExecutionId']}
    
    return payload