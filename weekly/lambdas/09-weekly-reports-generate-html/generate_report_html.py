import re
import boto3
import json
import pandas as pd
import numpy as np
from jinja2 import Environment, FileSystemLoader, Template
from datetime import datetime as dt
from datetime import timedelta as td
from io import StringIO

s3 = boto3.client('s3')
lambd = boto3.client('lambda')

def get_file(bucket, key):
    
    response = s3.get_object(Bucket=bucket, Key=key)
    content = response['Body'].read().decode('utf-8')
    
    return content

def get_template(env, bucket, key, template_name):
    
    open('/tmp/' + template_name, 'w').write(get_file(bucket, key))
    return env.get_template('/tmp/' + template_name)

def prev_weeks_days(today):
    '''(datetime.date) -> list(tuple)
    
    Return a list of tuple (datetime.date, datetime.date) where each entry has the day when a week begins and the day when it ends.
    The beggining and end of each week is based on today. The weeks are ordered by most recent dates.
    
    >>> today = dt.now().date()
    >>> today
    datetime.date(2019, 2, 19)
    >>> prev_weeks_days(today)
    [(datetime.date(2019, 2, 12), datetime.date(2019, 2, 18)), (datetime.date(2019, 2, 5), datetime.date(2019, 2, 11))]
    '''
    return [(today - td(days=7*i), today - td(days=1+7*(i-1))) for i in range(1,2+1)]

def city_queries_dataframes(event, report_params):    
    
    queries_df = {}
    
    for query in event['queries']:
        
        if "HEATMAP" not in query['query_name'].split("_"):
            query_name = query['query_name']
            
            df = pd.read_csv(StringIO(get_file(query['CSVBucket'], query['CSVKey'])))
            ### For some unkown reason, float columns are been casted as str, making sure their types
            ### are correct. DO NOT set street type to str because 'null' street will remain on table
            df = df.astype(dtype={'share_of_total_interactions_s1': np.float64,
                                    'share_of_total_interactions_s2': np.float64, 'variation': np.float64})
            queries_df[query_name] = df.dropna(subset=['street']).iloc[:report_params['table_rows']].fillna('')
            
    return queries_df


def lambda_handler(event, context):

    today = dt.fromtimestamp(event['timestamp'])
    bucket = event['bucket']
    prefix = event['prefix']
    report_params = event['report']['params']
    
    env = Environment(loader=FileSystemLoader('/'))
    report_template = get_template(env=env, template_name='report.html',
                                    bucket=event['report']['html']['report_template']['bucket'], 
                                    key=event['report']['html']['report_template']['key'])
    table_template = get_template(env=env, template_name='table_template.html',
                                    bucket=event['report']['html']['table_template']['bucket'], 
                                    key=event['report']['html']['table_template']['key'])
    
    prev_weeks = prev_weeks_days(today)
    date_s1 = f"{prev_weeks[0][0].strftime('%d/%m/%Y')} - {prev_weeks[0][1].strftime('%d/%m/%Y')}"
    date_s2 = f"{prev_weeks[1][0].strftime('%d/%m/%Y')} - {prev_weeks[1][1].strftime('%d/%m/%Y')}"
    
    #getting pandas dataframes
    queries_df = city_queries_dataframes(event, report_params)
    
    #getting table/img relation
    images = {k : "file:///tmp/img/" + v + '.png' for k, v in event['report']['img']['table-img'].items()}
    
    #rendering html templates
    template_vars = {'report_title' : 'weekly report',
                     'CITY' : event['city'],
                     'TIME_INTERVAL': date_s1,
                     'date_s1' : date_s1, 
                     'date_s2' : date_s2, 
                     'queries_df' : queries_df,
                     'table_template': table_template,
                     'images': images,
    }
    
    html_out = report_template.render(template_vars)
    
    del queries_df
    
    open('/tmp/html_out.html', 'w').write(html_out)
    s3.upload_file('/tmp/html_out.html', Bucket=bucket, Key=(prefix+"html_out.html"))
    
    #invoking pdf-generator lambda 
    event['report']['html']['html_out'] = {'bucket': bucket, 'key': prefix + "html_out.html"} 
    
    #### ALERTA ######
    #### MELHORAR ESSE TRECHO DO CÓDIGO #####
    if event['city'] == 'São Paulo':
        city = 'Sao-Paulo'
    else:
        city = event['city']
    ##########################################    
        
    event['report']['pdf'] = {'bucket': bucket, 
                                'key': prefix + f"{today.year}-{today.month:02d}-{today.day:02d}-fgv-bid-{city}.pdf"}
    
    lambd.invoke(FunctionName='697036326133:function:pdf-generator',
                 InvocationType='Event',                                        
                 Payload=json.dumps(event))
    
                 
    