import json
import folium
import boto3
import pandas as pd
import folium.plugins
from datetime import datetime as dt
from io import StringIO

lambd = boto3.client('lambda')
s3 = boto3.client('s3')

def get_file(bucket, key):
    
    response = s3.get_object(Bucket=bucket, Key=key)
    content = response['Body'].read().decode('utf-8')
    
    return content

def Map(coordinates: list, zoom_start: int, tiles: str, zoom_control: bool) -> folium.folium.Map:
    
    return folium.Map(location=coordinates, zoom_start=zoom_start, tiles=tiles, zoom_control=zoom_control)

def HeatMap(alerts):
    return folium.plugins.HeatMap(list(zip(alerts.latitude.values, alerts.longitude.values)),
                                    min_opacity=0.1,
                                    radius=3, blur=4,
                                    max_zoom=10,)      

def filter_alerts(alerts_df, report_params):
    
    return alerts_df[alerts_df.cum_share_street < 0.8] if alerts_df.shape[0] > report_params['table_rows']*5 else alerts_df

def lambda_handler(event, context):
    
    bucket = event['bucket']
    
    alerts = filter_alerts(pd.read_csv(StringIO(get_file(bucket=event['task']['CSVBucket'], key=event['task']['CSVKey']))),
                           event['report']['params'])
    
    base_map = Map(**event['task']['config'])
    
    heatmap_layer = HeatMap(alerts=alerts)

    base_map.add_child(heatmap_layer)

    base_map.save('/tmp/heatmap.html')
        
    key = event['task']['html_key']
    
    s3.upload_file('/tmp/heatmap.html', Bucket=bucket, Key=key)
    
    lambd.invoke(   
        FunctionName='pngen',
        InvocationType='Event',
        Payload=json.dumps(event))