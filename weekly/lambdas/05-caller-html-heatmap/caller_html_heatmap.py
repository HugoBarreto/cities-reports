import json
import boto3
from datetime import datetime as dt

lambd = boto3.client('lambda')

def lambda_handler(event, context):
   
    today = dt.fromtimestamp(event['timestamp'])
    bucket = event['bucket']
    prefix = event['prefix']
    
    event['report']['img']['files'] = []
   
    for query in event['queries']:
        
        if "HEATMAP" in query['query_name'].split("_"):
            
            for tiles in event['report']['img']['heatmap_config']['tiles_list']:
                
                query_name = query['query_name']
                filename = f"{today.year}-{today.month}-{today.day}-{event['city']}-{tiles}-{query_name}"
                html_key = prefix + "html/" + filename + ".html"
                png_key = prefix + "img/" + filename + ".png"
                
                
                config = {k:v for k, v in event['report']['img']['heatmap_config'].items() if k != 'tiles_list'}
                config['tiles'] = tiles
                
                task = {'html_key': html_key, 'png_key': png_key ,
                        'alert': query_name, 'CSVBucket': query['CSVBucket'], 'CSVKey': query['CSVKey'],
                        'tiles': tiles, 'config': config}
                
                event['report']['img']['files'].append(task)
                event['task'] = task
                    
                lambd.invoke(
                            FunctionName='generate-html-heatmap',
                            InvocationType='Event',
                            Payload=json.dumps(event))
                    
    return event