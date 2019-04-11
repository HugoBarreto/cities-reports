import boto3
import json
import argparse

######################################################################################################################
############################################# Edit below this line ###################################################
######################################################################################################################

######################################################################################################################
############### Repetitive content with sligth difference between cities #############################################

email_title_es = 'Reporte Semanal FGV BID: '
email_title_pt = 'Relatório Semanal FGV BID: '
email_html_es = """<html><head></head><body>Estimado responsable,<br><br>Este es un e-mail automático con el informe de alertas de tráfico basado en datos de Waze para la semana pasada.<br><br>Atentamente,</body></html>"""
email_html_pt = """<html><head></head><body>Prezado responsável,<br><br>Este é um e-mail automático com o relatório de alertas de tráfego baseado em dados do Waze referentes à semana passada.<br><br>Cordialmente,</body></html>"""

######################################################################################################################
############### Cities idiosyncrasies ################################################################################

def fetch_cities(test: bool) -> list:
    cities = [
                {'name': 'São Paulo', 'alerts_table': 'br_saopaulo_waze_alerts', 'coord': [-23.5333, -46.63333], 
                 'zoom': 11.2, 'email_title': email_title_pt + 'São Paulo', 'email_html': email_html_pt},

                {'name': 'Xalapa', 'alerts_table': 'mx_xalapa_waze_alerts', 'coord': [19.5437, -96.91033], 
                 'zoom': 13, 'email_title': email_title_es + 'Xalapa', 'email_html': email_html_es},

                {'name': 'Quito', 'alerts_table': 'ec_quito_waze_alerts', 'coord': [-0.185219,  -78.5248],
                 'zoom': 11.2, 'email_title': email_title_es + 'Quito', 'email_html': email_html_es},

                {'name': 'Montevideo', 'alerts_table': 'uy_montevideo_waze_alerts', 'coord': [ -34.8485,  -56.1967],
                 'zoom': 11.6, 'email_title': email_title_es + 'Montevideo', 'email_html': email_html_es},

                {'name': 'Miraflores', 'alerts_table': 'pe_lima_waze_alerts', 'coord': [-12.111062, -77.0315913],
                 'zoom': 13, 'email_title': email_title_es + 'Miraflores', 'email_html': email_html_es},
            ]
    if not test:
        # Return all cities
        return cities
    else:
        # Return only Miraflores as a list of one element
        return cities[-1:]

######################################################################################################################
############### Modify only if there are report's structural changes #################################################

def city_dict(name: str, alerts_table: str, coord: list, zoom: float, email_title: str, email_html: str, test: bool) -> dict:

    return{
        'city' : name,
        'queries' : [

                        {'query_name': 'JAM_ALERTS', 'params' : {'table': alerts_table, 'limit':''}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/JAM_ALERTS.sql'},
            
                        {'query_name': 'ACCIDENTS', 'params' : {'table': alerts_table, 'limit':''}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/ACCIDENTS.sql'},
            
                        {'query_name': 'POT_HOLE', 'params' : {'table': alerts_table, 'limit':''}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/POT_HOLE.sql'},
            
                        {'query_name': 'TRAFFIC_LIGHT_FAULT', 'params' : {'table': alerts_table, 'limit':''}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/TRAFFIC_LIGHT_FAULT.sql'},
            
                        {'query_name': 'FLOOD', 'params' : {'table': alerts_table, 'limit':''}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/FLOOD.sql'},
            
                        {'query_name': 'JAM_HEATMAP', 'params' : {'table': alerts_table, 'limit':'LIMIT 20'}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/JAM_ALERTS_HEATMAP.sql'},
            
                        {'query_name': 'ACCIDENTS_HEATMAP', 'params' : {'table': alerts_table, 'limit':'LIMIT 20'}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/ACCIDENTS_HEATMAP.sql'},
            
                        {'query_name': 'POT_HOLE_HEATMAP', 'params' : {'table': alerts_table, 'limit':'LIMIT 20'}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/POT_HOLE_HEATMAP.sql'},
            
                        {'query_name': 'TRAFFIC_LIGHT_FAULT_HEATMAP', 'params' : {'table': alerts_table, 'limit':'LIMIT 20'}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/TRAFFIC_LIGHT_FAULT_HEATMAP.sql'},
            
                        {'query_name': 'FLOOD_HEATMAP', 'params' : {'table': alerts_table, 'limit':'LIMIT 20'}, 
                         'bucket': 'waze-reports', 'key': 'weekly/support_files/queries/FLOOD_HEATMAP.sql'},
                    ],
        
        'report' : {
                    'params': {'table_rows': 20, 'tiles': 'CartoDB positron'},
                    
                    'img': {
                            'heatmap_config' : {'coordinates': coord,
                                            'zoom_start': zoom,
                                            'tiles_list': ["CartoDB dark_matter", "CartoDB positron"],
                                            'zoom_control': False},
                            'table-img': {                           
                                            'JAM_ALERTS' : 'JAM_HEATMAP',
                                            'ACCIDENTS': 'ACCIDENTS_HEATMAP', 
                                            'POT_HOLE': 'POT_HOLE_HEATMAP', 
                                            'TRAFFIC_LIGHT_FAULT': 'TRAFFIC_LIGHT_FAULT_HEATMAP', 
                                            'FLOOD': 'FLOOD_HEATMAP',
                                          },
                            'cover': {'bucket': 'waze-reports', 'key': 'weekly/support_files/img/cover.png'},
                            },
            
                     'html':{
                             'report_template': {'bucket': 'waze-reports', 'key': 'weekly/support_files/html/report.html'},
                             'table_template': {'bucket': 'waze-reports', 'key': 'weekly/support_files/html/table_template.html'},
                            },
            
                     'css': {'bucket': 'waze-reports', 'keys': ['weekly/support_files/css/report.css']},
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
    