#import boto3
import json
import argparse

################################################################################
############################# Edit below this line #############################
################################################################################

################################################################################
##### Repetitive content with sligth difference between cities #################

################################################################################
##### Cities idiosyncrasies ####################################################

def fetch_cities(test: bool) -> list:
    cities = [
                {
                  'name': 'São Paulo', 'support_files_bucket': 'waze-reports',
                  'output_bucket': 'waze-reports', 'database': 'cities',
                  'alerts_table': 'br_saopaulo_waze_alerts',
                  'agg_file_key': 'SaoPauloAgg.json',
                },

                {
                  'name': 'Xalapa', 'support_files_bucket': 'waze-reports',
                  'output_bucket': 'waze-reports', 'database': 'cities',
                  'alerts_table': 'mx_xalapa_waze_alerts',
                  'agg_file_key': 'XalapaAgg.json',
                },

                {
                  'name': 'Quito', 'support_files_bucket': 'waze-reports',
                  'output_bucket': 'waze-reports', 'database': 'cities',
                  'alerts_table': 'ec_quito_waze_alerts',
                  'agg_file_key': 'QuitoAgg.json',
                },

                {
                  'name': 'Montevideo', 'support_files_bucket': 'waze-reports',
                  'output_bucket': 'waze-reports', 'database': 'cities',
                  'alerts_table': 'uy_montevideo_waze_alerts',
                  'agg_file_key': 'MontevideoAgg.json',
                },

                {
                  'name': 'Miraflores', 'support_files_bucket': 'waze-reports',
                  'output_bucket': 'waze-reports', 'database': 'cities',
                  'alerts_table': 'pe_lima_waze_alerts',
                  'agg_file_key': 'MirafloresAgg.json',
                },
            ]
    if not test:
        # Return all cities
        return cities
    else:
        # Return only Miraflores as a list of one element
        # return cities[-1:]
        return cities[:1]

################################################################################
##### Modify only if there are report's structural changes #####################

def city_dict(
    test: bool, name: str, output_bucket: str, support_files_bucket: str,
    database: str, alerts_table: str, agg_file_key: str
  ) -> dict:

    return{
        'city' : name,
        'bucket' : output_bucket,
        'queries' : [
                        {
                          'query_name': 'ALERTS', 'database': database,
                          'table': alerts_table, 'params' : {'limit':''},
                          'bucket': support_files_bucket,
                          'key': 'dashboard/support_files/queries/Alerts.sql'
                        },
                    ],
        'agg_file': {
                      'bucket': 'hugo-data',
                      'key': agg_file_key,
                    },
    }

################################################################################
########################### Do Not Edit below this line ########################
################################################################################

def main():

    parser = argparse.ArgumentParser()
    parser.add_argument('-t', '--test', action='store_true')
    args = parser.parse_args()

    test = args.test

    dashboard_config = {'cities': []}
    cities = fetch_cities(test)

    for city in cities:
        dashboard_config['cities'].append(city_dict(test=test, **city))

    if not test:
        json.dump(dashboard_config, open('dashboard_config.json', 'w'))
    else:
        json.dump(dashboard_config, open('dash_test.json', 'w'))

if __name__ == '__main__':
    main()
