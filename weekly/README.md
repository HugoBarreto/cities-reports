Project Description
------------------
This project is about generating weekly reports automatically from cities' available data on a serverless infrastructure.

For each city, will be generated one report summarizing the last 7 days of occurrences, bringing the most relevant information to city's authorities and to the public.


Project Organization
------------

    ├── README.md                   <- README for developers using this specific report.
    ├── Makefile                    <- automate routine jobs
    ├── rc_test.json                <- a reports_config like file, but for testing purpose
    ├── reports_config.json         <- contains all import data used by the serveless infrastructure to generate the report
    ├── update_reports_config.json  <- Python script to update reports_config.json
    ├── data
    │   ├── output            <- Output processed data
    │   └── raw               <- The original, immutable data dump.
    ├── lambdas               <- AWS lambdas source code
    ├── layers                <- Lambda layers (packages used by some lambdas)
    ├── notebooks             <- Jupyter notebooks
    └── templates          
        ├── css               <- css used for pdf generation
        ├── html              <- jinja2 html templates
        ├── queries           <- sql templates to query through Athena API
        └── tmp               <- temporary templates to experiment and play around
