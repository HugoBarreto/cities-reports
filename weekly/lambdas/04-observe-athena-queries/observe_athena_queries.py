import json
import boto3

athena = boto3.client('athena')

def lambda_handler(event, context):
    
    done = True
    error = False
    
    QueryExecutionIds = [query['QueryExecutionId'] for query in event['queries']]
    
    queries_response = athena.batch_get_query_execution(QueryExecutionIds=QueryExecutionIds)
    queries_status = [query['Status']['State'] for query in queries_response['QueryExecutions']]
    
    if queries_response['UnprocessedQueryExecutionIds']:
        done = False
        error = True
        return {'done': done, 'error': error,
                'UnprocessedQueryExecutionIds' : queries_response['UnprocessedQueryExecutionIds']}
    
    for status in queries_status:
        if status == 'RUNNING' or status == 'QUEUED':
            done = False
        elif status == 'FAILED' or status == 'CANCELLED':
            done = False
            error = True
            return {'done': done, 'error': error,
                'UnprocessedQueryExecutionIds':[]}
    
    return {'done': done, 'error': error}