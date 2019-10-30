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

def get_template(env, bucket, key, gen):
    
    template_name = 'template' + str(next(gen)) + '.html'
    open('/tmp/' + template_name, 'w').write(get_file(bucket, key))
    return env.get_template('/tmp/' + template_name)

def get_df(bucket, key):
    
    return pd.read_csv(StringIO(get_file(bucket, key)))

def get_dataframe(bucket, key=None, event=None, query_name=None, today=None, weeks: int=0):
    '''
    Return past dataframes generated on the process of older reports.
    This function assumes the pattern of prefix is kept.
    '''
    if key:
        return get_df(bucket, key)
    
    assert today is not None and query_name is not None and weeks >= 0
    
    date = today - td(days=7*weeks)
    date_prefix = f"weekly/data/city={event['city']}/year={date.year}/month={date.month}/day={date.day}/" 
    csv_prefix = date_prefix + f"query_name={query_name}/"
    keys = [obj['Key'] for obj in s3.list_objects_v2(Bucket=bucket, Prefix=csv_prefix).get('Contents', [])]
    
    try:
        # It assumes there is only one csv in the folder
        key = list(filter(lambda s: '.csv' in s[-4:], keys))[0]
    except:
        dic = {'bucket': bucket, 'prefix': date_prefix, 'timestamp': dt.timestamp(date), 'city': event['city'], 
               'task': list(filter(lambda query: query['query_name'] == query_name, event['queries']))[0],}
        
        lambd.invoke(FunctionName='weekly-reports-query-athena',
                     Payload=json.dumps(dic))
        
        class DataframeDoesNotExist(Exception): pass
        raise DataframeDoesNotExist('Failed to load past weeks dataframes')
        
    return get_df(bucket, key)
    

def prev_weeks_days(today, weeks):
    '''(datetime.date) -> list(tuple)
    
    Return a list of tuple (datetime.date, datetime.date) where each entry has the day when a week begins and the day when it ends.
    The beggining and end of each week is based on today. The weeks are ordered by most recent dates.
    
    >>> today = dt.now().date()
    >>> today
    datetime.date(2019, 2, 19)
    >>> prev_weeks_days(today)
    [(datetime.date(2019, 2, 12), datetime.date(2019, 2, 18)), (datetime.date(2019, 2, 5), datetime.date(2019, 2, 11))]
    '''
    return [(today - td(days=7*i), today - td(days=1+7*(i-1))) for i in range(1,1+weeks)]


def preprocess_df(df, col, val):
    '''
    This function filter the dataframe that contains all types of alerts into one that contains only one type of alert
    and assing the variation column
    '''
    assert col in ['type', 'subtype'] 
    
    if col == 'type':
        return df[df[col] == val].dropna(subset=['street']).groupby(['street'], sort=False).sum()\
                .assign(variation= lambda x: (x.interactions_s1 / x.interactions_s2) - 1)\
                .assign(variation_share= lambda x: (x.share_type_s1 / x.share_type_s2) - 1)\
                .sort_values('interactions_s1', ascending=False).reset_index()
    return  df[df[col] == val].dropna(subset=['street'])\
                .assign(variation= lambda x: (x.interactions_s1 / x.interactions_s2) - 1)\
                .assign(variation_share= lambda x: (x.share_subtype_s1 / x.share_subtype_s2) - 1 )\

def format_df(df, kind, table, report_params):
    '''
    This function format the dataframe in a way to be used in jinja2 html templates
    '''
    # Asserting it is a valid kind of alert
    assert kind in ['type', 'subtype'] , 'kind param is not valid. Only "type" and "subtype"'
    
    # Filtering Columns and changing their names depending on kind of alert
    if kind == 'type':
        df = df.loc[:, ['street', 'share_type_s1','share_type_s2','variation_share',]]\
                .rename(columns={'share_type_s1':'share_s1', 'share_type_s2':'share_s2'})
    elif kind == 'subtype':
        df = df.loc[:, ['street', 'share_subtype_s1','share_subtype_s2','variation_share',]]\
                .rename(columns={'share_subtype_s1':'share_s1', 'share_subtype_s2':'share_s2'})
    
    # Asserting it is a valid table format
    assert table in ['table', 'mini+', 'mini-', 'mini_lastweek'], 'table param is not valid'
    
    # Table that shows evolution of most relevant streets in last week
    if table == 'mini_lastweek':
        return df.sort_values('share_s2', ascending=False).iloc[:report_params['mini_table_lastweek_rows']]\
                    .dropna(subset=['share_s2']).replace([np.nan, np.inf, 0], '')
    
    # Selecting only the necessary rows and changin some values (Nan and Inf to '')
    df = df.iloc[:report_params['table_rows']].replace(np.inf, np.nan)
    if table == 'mini+':
        df = df.sort_values('variation_share').iloc[:report_params['mini_table_rows']]
    elif table == 'mini-':
        df = df.sort_values('variation_share', ascending=False).iloc[:report_params['mini_table_rows']]

    return df.replace([np.nan, np.inf, 0], '')

def generate_alerts_tables(weeks_df, types_alerts, report_params): 
    
    preprocessed_dfs = {alert: (t, preprocess_df(weeks_df, t, alert)) for t, li in types_alerts.items() for alert in li}

    tables_lambdas = list(map(lambda table: lambda tup: format_df(tup[1], tup[0], table, report_params),
                              ['table', 'mini+', 'mini-','mini_lastweek']))

    return {alert: list(map(lambda f: f((t, processed_df)), tables_lambdas)) for alert, (t, processed_df) in preprocessed_dfs.items()}

def generate_alerts_vars(event, bucket, types_alerts, titles, today, report_params):
    
    week1_key = list(filter(lambda query: query['query_name'] == 'ALERTS', event['queries']))[0]['CSVKey']
    
    week1 = get_dataframe(bucket, key=week1_key)
    week2 = get_dataframe(bucket, event=event, query_name='ALERTS', today=today, weeks=1)
    
    weeks = week1.join(week2.set_index(['type', 'subtype', 'street']), on=['type', 'subtype', 'street'],
                  lsuffix='_s1', rsuffix='_s2')        
    
    return {alert: (titles[event['lang']][alert], *tables) 
            for alert, tables in generate_alerts_tables(weeks, types_alerts, report_params).items()}  

def alert_prefix(filename):
    
    if 'ACCIDENT' in filename: return 'Accidents/'
    elif 'POT_HOLE' in filename: return 'PotHoles/'
    elif 'JAM' in filename: return 'Jams/'
    elif 'FLOOD' in filename: return 'Floods/'
    elif 'TRAFFIC_LIGHT' in filename: return 'TrafficLightFault/'

def lambda_handler(event, context):
    
    # Getting weeks intervals
    today = dt.fromtimestamp(event['timestamp'])
    prev_weeks = prev_weeks_days(today, weeks=2)
    date_s1 = f"{prev_weeks[0][0].strftime('%d/%m/%Y')} - {prev_weeks[0][1].strftime('%d/%m/%Y')}"
    date_s2 = f"{prev_weeks[1][0].strftime('%d/%m/%Y')} - {prev_weeks[1][1].strftime('%d/%m/%Y')}"
    
    # Getting html templates
    report_params = event['report']['params']
    report_html = event['report']['html']
    templates_bucket = report_html['bucket']
    gen = (i for i in range(1000)) #just for naming templates on /tmp folder
    
    env = Environment(loader=FileSystemLoader('/'), extensions=['jinja2.ext.loopcontrols'])
    report_template = get_template(env=env, gen=gen, bucket=templates_bucket, key=report_html['report_template'])
    table_template = get_template(env=env, gen=gen, bucket=templates_bucket, key=report_html['table_template'])
    mini_tables = get_template(env=env, gen=gen, bucket=templates_bucket, key=report_html['mini_tables'])
    exec_summary = get_template(env=env, gen=gen, bucket=templates_bucket, key=report_html['exec_summary'])
    img_template = get_template(env=env, gen=gen, bucket=templates_bucket, key=report_html['img_template'])
    
    
    #getting pandas dataframes
    bucket = event['bucket']
    titles = event['report']['titles']
    types_alert = event['report']['types_alert']    
    alerts_vars = generate_alerts_vars(event, bucket, types_alert, titles, today, report_params)
    
    #getting table/img relation    
    images = {alert : "file:///tmp/img/" + alert + '.png' for l in types_alert.values() for alert in l}
    
    #getting img/link relation
    base_html = "http://bd-fgv-public.s3.us-east-2.amazonaws.com/"
    city = event['city'].replace("ã", "a")
    linkPrefix = '/'.join(map(lambda x: x.zfill(2), 
                              ['exports/reports/weekly', str(today.year), str(today.month), str(today.day), city])) + '/maps/'
    mapLinks = {alert : base_html + linkPrefix + alert_prefix(alert) + 'kepler.gl.html' for l in types_alert.values() for alert in l}
    
    #rendering html templates
    template_vars = {'report_title' : 'weekly report',
                     'CITY' : event['city'],
                     'lang': event['lang'],
                     'TIME_INTERVAL': date_s1,
                     'date_s1' : date_s1, 
                     'date_s2' : date_s2, 
                     'alerts_vars' : alerts_vars,
                     'table_template': table_template,                     
                     'mini_tables_template': mini_tables,
                     'exec_summary': exec_summary,
                     'img_template': img_template,                     
                     'images': images,
                     'mapLinks': mapLinks,
    }
    
    html_out = report_template.render(template_vars)
    
    # Saving output (rendered html) in S3    
    prefix = event['prefix']
    
    open('/tmp/html_out.html', 'w').write(html_out)
    s3.upload_file('/tmp/html_out.html', Bucket=bucket, Key=(prefix+"html_out.html"))
    
    # Invoking pdf-generator lambda 
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
    
                 
    