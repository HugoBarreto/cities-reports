import json
import boto3
from datetime import datetime as dt

lambd = boto3.client('lambda')

def lambda_handler(event, context):
   
    today = dt.fromtimestamp(event['timestamp'])    
    prefix = event['prefix']
    
    event['report']['img']['files'] = []
   
    for query in event['queries']:
        
        if "HEATMAP" in query['query_name'].split("_"):        
                
            query_name = query['query_name']                
            filename = f"{today.year}-{today.month}-{today.day}-{event['city']}-{query_name}"                
            png_key = prefix + "img/" + filename + ".png"
                            
            
            task = {                
                    'png_key': png_key, 'alert': query['related_alert'],
                    'CSVBucket': query['CSVBucket'], 'CSVKey': query['CSVKey'],                        
                    }
            
            event['report']['img']['files'].append(task)
            event['task'] = task


            #################### Attention for Docker Test and AWS Production ################

            lambd.invoke(
                        FunctionName='generate-js-files',
                        InvocationType='Event',
                        Payload=json.dumps(event))
                    
    return event