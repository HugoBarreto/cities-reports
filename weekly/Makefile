nothing:
	echo "Be careful"

update-queries:
	aws s3 cp ./templates/queries s3://waze-reports/weekly/support_files/queries --recursive

update-html-templates-local:
	cp ./templates/html/report.html ./notebooks/report/ 
	cp ./templates/html/table_template.html  ./notebooks/report/

update-html-templates:
	aws s3 cp ./templates/html/ s3://waze-reports/weekly/support_files/html/ --recursive

update-css-local:
	cp ./templates/css/report.css ./notebooks/report/

update-css:
	aws s3 cp ./templates/css/report.css s3://waze-reports/weekly/support_files/css/

update-reports-config:
	python update_reports_config.py
	cp reports_config.json ./data/raw/
	aws s3 cp reports_config.json s3://waze-reports/weekly/support_files/
    
update-test:
	python update_reports_config.py -t
	aws s3 cp rc_test.json s3://waze-reports/weekly/support_files/
    
update-all-templates: update-queries update-html-templates update-css

update-all-test: update-all-templates update-test

update-all: update-all-test update-reports-config