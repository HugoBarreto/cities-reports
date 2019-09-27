#import boto3
import json
import argparse

######################################################################################################################
############################################# Edit below this line ###################################################
######################################################################################################################

######################################################################################################################
############### Repetitive content with sligth difference between cities #############################################

email_title_es = 'Reporte Semanal FGV BID: '
email_title_pt = 'Relatório Semanal FGV BID: '
email_html_es = """<html><head></head><body>Estimado responsable,<br><br>Este es un e-mail automático con el informe en pdf de alertas de tráfico basado en datos de Waze para la semana pasada.<br><br>Si no puede ver el archivo, accede a nuestro repositorio donde se encuentra el archivo para descargar: <a href="http://bd-fgv-public.s3.us-east-2.amazonaws.com/index.html?prefix={prefix}">BID-FGV Public</a><br><br>Atentamente,</body></html>"""
email_html_pt = """<html><head></head><body>Prezado responsável,<br><br>Este é um e-mail automático com o relatório, em pdf, de alertas de tráfego baseado em dados do Waze referentes à semana passada.<br><br>Caso não consiga visualizar o arquivo, acesse nosso repositório onde se encontra o arquivo para download: <a href="http://bd-fgv-public.s3.us-east-2.amazonaws.com/index.html?prefix={prefix}">BID-FGV Public</a><br><br>Cordialmente,</body></html>"""

######################################################################################################################
############### Cities idiosyncrasies ################################################################################

def fetch_cities(test: bool) -> list:
    cities = [
                {'name': 'São Paulo', 'support_files_bucket': 'waze-reports', 'output_bucket': 'waze-reports', 
                 'database': 'cities', 'alerts_table': 'br_saopaulo_waze_alerts', 'lang': 'pt',
                 'coord': [-23.5333, -46.63333], 'zoom': 11.2, 'email_title': email_title_pt + 'São Paulo', 'email_html': email_html_pt},

                {'name': 'Xalapa', 'support_files_bucket': 'waze-reports', 'output_bucket': 'waze-reports', 
                 'database': 'cities', 'alerts_table': 'mx_xalapa_waze_alerts', 'lang': 'es',
                 'coord': [19.5437, -96.91033], 'zoom': 13, 'email_title': email_title_es + 'Xalapa', 'email_html': email_html_es},

                {'name': 'Quito', 'support_files_bucket': 'waze-reports', 'output_bucket': 'waze-reports',
                 'database': 'cities', 'alerts_table': 'ec_quito_waze_alerts', 'lang': 'es',
                 'coord': [-0.185219,  -78.5248], 'zoom': 11.2, 'email_title': email_title_es + 'Quito', 'email_html': email_html_es},

                {'name': 'Montevideo', 'support_files_bucket': 'waze-reports', 'output_bucket': 'waze-reports',
                 'database': 'cities', 'alerts_table': 'uy_montevideo_waze_alerts', 'lang': 'es',
                 'coord': [ -34.8485,  -56.1967], 'zoom': 11.6, 'email_title': email_title_es + 'Montevideo', 'email_html': email_html_es},

                {'name': 'Miraflores', 'support_files_bucket': 'waze-reports', 'output_bucket': 'waze-reports',
                 'database': 'cities', 'alerts_table': 'pe_lima_waze_alerts', 'lang': 'es',
                 'coord': [-12.1110, -77.03159], 'zoom': 13, 'email_title': email_title_es + 'Miraflores', 'email_html': email_html_es},
            ]
    if not test:
        # Return all cities
        return cities
    else:
        # Return only Miraflores as a list of one element
        return cities[-1:]

######################################################################################################################
############### Modify only if there are report's structural changes #################################################

def city_dict(name: str, lang: str, output_bucket: str, support_files_bucket: str, database: str, alerts_table: str, coord: list, 
              zoom: float, email_title: str, email_html: str, test: bool, table_rows: int=20, mini_table_rows: int=3, 
              mini_table_lastweek_rows: int=5) -> dict:

    return{
        'city' : name,
        'lang': lang,
        'bucket' : output_bucket,
        'queries' : [

                        {'query_name': 'ALERTS', 'database': database, 'table': alerts_table, 'params' : {'limit':''},
                         'bucket': support_files_bucket, 'key': 'weekly/support_files/queries/ALERTS.sql'},                        

                        {'query_name': 'JAM_HEATMAP', 'database': database, 'table': alerts_table, 
                         'params' : {'limit':f'LIMIT {table_rows}'}, 'bucket': support_files_bucket, 
                         'key': 'weekly/support_files/queries/JAM_ALERTS_HEATMAP.sql',
                         'related_alert': 'JAM'},

                        {'query_name': 'ACCIDENTS_HEATMAP', 'database': database, 'table': alerts_table, 
                         'params' : {'limit':f'LIMIT {table_rows}'}, 'bucket': support_files_bucket, 
                         'key': 'weekly/support_files/queries/ACCIDENTS_HEATMAP.sql',
                         'related_alert': 'ACCIDENT'},

                        {'query_name': 'POT_HOLE_HEATMAP', 'database': database, 'table': alerts_table, 
                         'params' : {'limit':f'LIMIT {table_rows}'}, 'bucket': support_files_bucket, 
                         'key': 'weekly/support_files/queries/POT_HOLE_HEATMAP.sql',
                         'related_alert': 'HAZARD_ON_ROAD_POT_HOLE'},

                        {'query_name': 'TRAFFIC_LIGHT_FAULT_HEATMAP', 'database': database, 'table': alerts_table,
                         'params' : {'limit':f'LIMIT {table_rows}'}, 'bucket': support_files_bucket, 
                         'key': 'weekly/support_files/queries/TRAFFIC_LIGHT_FAULT_HEATMAP.sql',
                         'related_alert': 'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT'},

                        {'query_name': 'FLOOD_HEATMAP', 'database': database, 'table': alerts_table, 
                         'params' : {'limit':f'LIMIT {table_rows}'}, 'bucket': support_files_bucket, 
                         'key': 'weekly/support_files/queries/FLOOD_HEATMAP.sql',
                         'related_alert': 'HAZARD_WEATHER_FLOOD'},
                    ],
        
        'report' : {
                    'params': {'table_rows': table_rows, 'mini_table_rows': mini_table_rows, 
                               'mini_table_lastweek_rows': mini_table_lastweek_rows,
                               'tiles': 'CartoDB positron'},
            
                    'types_alert': {'type':['JAM', 'ACCIDENT'], 
                                    'subtype':['HAZARD_ON_ROAD_POT_HOLE', 'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT', 'HAZARD_WEATHER_FLOOD']},
            
                    'titles': {'pt':{'ACCIDENT': 'ACIDENTES', 
                                     'JAM': 'ENGARRAFAMENTOS',
                                     'HAZARD_ON_ROAD_POT_HOLE': 'BURACOS',
                                     'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT': 'SEMÁFAROS COM DEFEITO',
                                     'HAZARD_WEATHER_FLOOD': 'ENCHENTES'},                               
                               'es': {'ACCIDENT': 'ACCIDENTES',
                                      'JAM': 'ATASCOS', 
                                      'HAZARD_ON_ROAD_POT_HOLE': 'AGUJEROS',
                                      'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT': 'SEMÁFAROS CON DEFECTO',
                                      'HAZARD_WEATHER_FLOOD': 'INUNDACIONES'}
                              },
            
                    'img': {'bucket': support_files_bucket,
                            'cover': 'weekly/support_files/img/cover.png',
                            'heatmap_config' : {'coordinates': coord,
                                                'zoom_start': zoom,
                                                '#TopStreetsDisplayed': 5,
                                                'tiles_list': ["CartoDB dark_matter", "CartoDB positron"],
                                                'zoom_control': False},
                            'datasetsTemplate': 'weekly/support_files/img/datasets.json',                            
                            'mapConfigTemplate': 'weekly/support_files/img/mapConfig.json',
                            'KeplerHTML':  'weekly/support_files/img/kepler.gl.html',
                            },
                     'html':{
                             'bucket': support_files_bucket,
                             'report_template': 'weekly/support_files/html/report.html',
                             'table_template': 'weekly/support_files/html/table_template.html',             
                             'mini_tables': 'weekly/support_files/html/mini_tables_template.html',
                             'exec_summary': 'weekly/support_files/html/exec_summary.html',
                             'img_template': 'weekly/support_files/html/img_template.html',
                            },
            
                     'css': {'bucket': support_files_bucket, 'keys': ['weekly/support_files/css/report.css']},
                    },
        
        'email' : {
                    'sender': 'Pablo Cerdeira <pablo.cerdeira@fgv.br>', 
                    'recipients': ['bid-fgv-ciudades@googlegroups.com', 'hugobarreto94@gmail.com'] if not test else ['hugobarreto94@gmail.com'], 
                    'title': email_title, 
                    'html': email_html, 
                    'attachments': []
                },
        
        'public': {'bucket': 'bd-fgv-public'},
        'polygon' : None 
    }

######################################################################################################################
############################################# Do Not Edit below this line ############################################
######################################################################################################################

def main():
    
    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--test', action='store_true')
    args = parser.parse_args()  
    
    test = args.test

    reports_config = {'cities': []}
    cities = fetch_cities(test)
    
    for city in cities:
        reports_config['cities'].append(city_dict(test=test, **city))    

    if not test:
        json.dump(reports_config, open('reports_config.json', 'w'))
    else:
        json.dump(reports_config, open('rc_test.json', 'w'))

if __name__ == '__main__':
    main()
    