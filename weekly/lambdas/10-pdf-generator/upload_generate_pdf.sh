rm pdf-reports.zip
cd weasyprint_for_awslambda/ 
zip -r9 ../pdf-reports.zip .
cd .. 
zip -g pdf-reports.zip lambda_function.py
aws s3 cp pdf-reports.zip s3://waze-reports/packages/
aws lambda update-function-code --function-name arn:aws:lambda:us-east-2:697036326133:function:pdf-generator --s3-bucket waze-reports --s3-key packages/pdf-reports.zip
