import json
import boto3
from datetime import datetime as dt
from datetime import timedelta as td

# athena constant
DATABASE = 'cities'
s3 = boto3.client('s3')
athena = boto3.client('athena')

def prev_weeks_days(today):
    '''(datetime.date) -> list(tuple)
    
    Return a list of tuple (datetime.date, datetime.date) where each entry has the day when a week begins and the day when it ends.
    The beggining and end of each week is based on today. The weeks are ordered by most recent dates.
    
    >>> today = dt.now().date()
    >>> today
    datetime.date(2019, 2, 19)
    
    >>> prev_weeks_days(today)
    [(datetime.date(2019, 2, 12), datetime.date(2019, 2, 18)), (datetime.date(2019, 2, 5), datetime.date(2019, 2, 11))]
    
    >>> prev_weeks_days(today)[0]
    (datetime.date(2019, 2, 12), datetime.date(2019, 2, 18))
    >>> prev_weeks_days(today)[1]
    (datetime.date(2019, 2, 5), datetime.date(2019, 2, 11))
    '''
    return [(today - td(days=7*i), today - td(days=1+7*(i-1))) for i in range(1,2+1)]

def date_filters(today):
    temp = []
    prev_weeks = prev_weeks_days(today)
    
    for sun, sat in prev_weeks:
        if sun.month != sat.month:
            if sun.year != sat.year:
                temp.append(f"""((year = {sun.year} AND month = {sun.month} AND day BETWEEN {sun.day} AND 31) OR (year = {sat.year} AND month = {sat.month} AND day BETWEEN 1 AND {sat.day}))""")
            else:
                temp.append(f"""year = {sun.year} AND ((month = {sun.month} AND day BETWEEN {sun.day} AND 31) OR (month = {sat.month} AND day BETWEEN 1 AND {sat.day}))""")
        else:
            temp.append(f"""year = {sun.year} AND month = {sun.month}  AND day BETWEEN {sun.day} AND {sat.day}""")
    
    return temp

def get_query(event, today):
    
    bucket = event['task']['bucket']
    key = event['task']['key']
    
    response = s3.get_object(Bucket=bucket, Key=key)
    
    # this is the raw query
    payload = response['Body'].read().decode('utf-8')

    query = payload.format(city=event['city'], date_filters=date_filters(today), 
                            table=event['task']['params']['table'], 
                            limit=event['task']['params']['limit'])
    
    return query


def lambda_handler(event, context):
    
    #params extracted from execution
    today = dt.fromtimestamp(event['timestamp'])
    
    # S3 constant
    bucket = event['bucket']
    query_prefix = event['prefix'] + f"query_name={event['task']['query_name']}/"
    S3_OUTPUT = "s3://" + bucket +  "/" + query_prefix

    # created query
    query = get_query(event, today)

    # athena client

    # Execution
    response = athena.start_query_execution(
        QueryString=query,
        QueryExecutionContext={'Database': DATABASE},
        ResultConfiguration={'OutputLocation': S3_OUTPUT},
        WorkGroup='AutomaticReports')
    
    payload = {'CSVBucket': bucket, "CSVKey": query_prefix + response['QueryExecutionId'] + ".csv"}
    payload['QueryExecutionId'] = response['QueryExecutionId']
    
    return payload