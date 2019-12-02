import json
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
    
    done = True
    error = False
    
    bucket = event['bucket']
    img_prefix = event['prefix'] + 'img/'
    
    # all png keys we expect to be created
    all_png = [file['png_key'] for file in event['report']['img']['files']]

    # all created images until listing them in the bucket
    created_png = [obj['Key'] for obj in s3.list_objects_v2(Bucket=bucket, Prefix=img_prefix).get('Contents', [])]
    
    for png in all_png:
        if png not in created_png:
            done = False
    
    return {"done": done, "error": error}
    