import json
import boto3
import pandas as pd
from datetime import datetime as dt
from io import StringIO

lambd = boto3.client('lambda')
s3 = boto3.client('s3')

def get_payload(bucket, key):
    
    return s3.get_object(Bucket=bucket, Key=key)['Body'].read().decode('utf-8')

def get_file(bucket, key, read_function=lambda x: x):
    
    return read_function(get_payload(bucket, key))

def lambda_handler(event, context):
    
    bucket = event['bucket']

    heatmap_config = event['report']['img']['heatmap_config']
    
    alerts = pd.read_csv(StringIO(get_file(bucket=event['task']['CSVBucket'], key=event['task']['CSVKey'])))
    streets = (alerts[['street','interactions']].groupby('street').sum()
                    .sort_values('interactions', ascending=False)
                    .iloc[:heatmap_config['#TopStreetsDisplayed']]
                    .index.tolist())
                    
    ########### datasets.js setup

    datasets = get_file(event['report']['img']['bucket'], 
                    event['report']['img']['datasetsTemplate'],
                    json.loads)

    datasets[0]['data']['allData'] = alerts.values.tolist()

    datasets[1]['data']['allData'] = alerts[alerts.street.isin(streets)].values.tolist()

    with open('/tmp/datasets.js', 'w') as f:
        f.write('const datasets = ' + json.dumps(datasets) + ';')
    

    key =  event['prefix'] + f"datasets-{event['taks']['alert']}.js"
    s3.upload_file('/tmp/datasets.js', Bucket=bucket, Key=key)
    # s3.upload_file('/tmp/datasets.js', Bucket=bucket, Key='test/datasetsOutput.js')
    event['task']['dataset_key'] = key
    
    ########### mapConfig.js setup - reduncy, should only do it once, not for every alert; room for improvement

    mapConfig = get_file(event['report']['img']['bucket'], 
                    event['report']['img']['mapConfigTemplate'],
                    json.loads)

    mapConfig['config']['mapState']['latitude'] = heatmap_config['coordinates'][0]
    mapConfig['config']['mapState']['longitude'] = heatmap_config['coordinates'][1]
    mapConfig['config']['mapState']['zoom'] = heatmap_config['zoom_start']
    mapConfig['config']['mapState']['bearing'] = heatmap_config['bearing']

    with open('/tmp/mapConfig.js', 'w') as f:
        f.write('const config = ' + json.dumps(mapConfig) + ';')

    key =  event['prefix'] + 'mapConfig.js'
    s3.upload_file('/tmp/mapConfig.js', Bucket=bucket, Key=key)
    # s3.upload_file('/tmp/mapConfig.js', Bucket=bucket, Key='test/mapConfigOutput.js')
    event['task']['config_key'] = key
    
    event['task']['KeplerHTML']  = event['report']['img']['KeplerHTML']

    lambd.invoke(   
        FunctionName='pngen',
        InvocationType='Event',
        Payload=json.dumps(event))