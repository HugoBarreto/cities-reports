# Lambdas
These are all the lambdas' source code necessary to generate the weekly report.


## 01 Weekly Report Starter

> Triggered by: CloudWatch Events <br>
> Runtime: Python 3.7 <br>
> Role: waze-fetcher <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 0 min 3 s

This is the first lambda, its main objective is to start a State Machine that will manage to trigger each city's report generation process within a secure time interval between them, in order to not reach Athena's API limits.

It has a CloudWatch Events trigger which invokes the lambda based on a cron expression (Every sunday at 12:00 UTC)

> weekly-sun <br>
>Schedule expression: `cron(0 12 ? * Sun *)`

This lambda reads the reports_config.json stored in a S3 bucket, then it starts the execution of weekly-reports-starter Step Function (the State Machine mentioned above).

## 02 Weekly Report Caller

> Triggered by: State Machine weekly-reports-starter <br>
> Runtime: Python 3.6 <br>
> Role: waze-fetcher <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 1 min 0 s

This function is invoked for each city in the cities list stored in `reports_config.json`. In other words, each call of this function starts the generation process of only one city's report.

This function invokes query-athena for each query necessary to generate the report, stores the resulting csv files' path, then starts the execution of weekly-reports Step Function.

## 03 Weekly Report Query Athena

> Triggered by: Lambda weekly-report-caller <br>
> Runtime: Python 3.6 <br>
> Role: waze-fetcher <br>
> Layers: boto3 <br>
> Memory: 128 MB <br>
> Timeout: 0 min 3 s

This lambda is called for each query executed on Athena.

It first fetches the query template, formats it with specific parameters from each city, call Athena and return the resulting csv file's path

## 04 Observe Athena Queries

> Triggered by: State Machine weekly-reports <br>
> Runtime: Python 3.7 <br>
> Role: ReadAll-S3-Athena <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 0 min 30 s

This lambda is invoked by weekly-reports Step Function to check whether all the queries has succeeded or not, in order to proceed to the next steps.

## 05 Caller html Heatmap

> Triggered by: State Machine weekly-reports <br>
> Runtime: Python 3.7 <br>
> Role: waze-fetcher <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 0 min 30 s

It manages to invoke generate-html-heatmap for each Image with a Heatmap layer on it.

## 06 Generate html Heatmap

> Triggered by: Lambda caller-html-heatmap <br>
> Runtime: Python 3.6 <br>
> Role: waze-fetcher <br>
> Layers: None <br>
> Memory: 512 MB <br>
> Timeout: 0 min 30 s

It generates a image with heatmap as a html file using pandas and folium layers

## 07 pngen

> Triggered by: Lambda generate-html-heatmap <br>
> Runtime: Python 3.6 <br>
> Role: waze-fetcher <br>
> Layers: None <br>
> Memory: 768 MB <br>
> Timeout: 1 min 0 s


It generates a png file from a html one by reading it with headless chromium and taking a screenshot.

## 08 Observer pngen

> Triggered by: State Machine weekly-reports <br>
> Runtime: Python 3.7 <br>
> Role: ReadAll-S3-Athena <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 0 min 3 s

Analogous to Observe Athena Queries

## 09 Weekly Reports Generate html (generate_report_html.py)

> Triggered by: State Machine weekly-reports <br>
> Runtime: Python 3.6 <br>
> Role: waze-fetcher <br>
> Layers: jinja2, pandas <br>
> Memory: 256 MB <br>
> Timeout: 1 min 3 s


This lambda is invoked by weekly-reports Step Function after all queries and images are done.

It takes a hmtl template and renders it with jinja2 then invokes pdf-generator

## 10 PDF Generator

> Triggered by: Lambda weekly-reports-generate-html <br>
> Runtime: Python **2.7** <br>
> Role: waze-fetcher <br>
> Layers: jinja2, pandas <br>
> Memory: 128 MB <br>
> Timeout: 2 min 3 s

It generates the pdf from a html file and css stylesheets using WeasyPrint. When it is done, invokes send-email

## 11 Send email

> Triggered by: Lambda pdf-generator <br>
> Runtime: Python 3.7 <br>
> Role: send-email <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 1 min 3 s

It fetches any attachments and sends emails to target recipients through Amazon SES API

## Copy file to Public Bucket

> Triggered by: S3 <br>
> Runtime: Python 3.6 <br>
> Role: copy-save-s3 <br>
> Layers: None <br>
> Memory: 128 MB <br>
> Timeout: 0 min 30 s

Copy all the csv files and the report pdf to public bucket in order to anyone access and dowload them.


# Roles
