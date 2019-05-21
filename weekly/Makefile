nothing:
	echo "Be careful"

upload-queries:
	aws s3 cp ./templates/queries s3://waze-reports/weekly/support_files/queries --recursive

update-html-templates:
	cp ./templates/html/report.html ./notebooks/report/ 
	cp ./templates/html/table_template.html  ./notebooks/report/

upload-html-templates: update-html-templates
	aws s3 cp ./templates/html/report.html s3://waze-reports/weekly/support_files/html/
	aws s3 cp ./templates/html/table_template.html s3://waze-reports/weekly/support_files/html/

update-css:
	cp ./templates/css/report.css ./notebooks/report/

upload-css: update-css
	aws s3 cp ./templates/css/report.css s3://waze-reports/weekly/support_files/css/

update-reports-config:
	python update_reports_config.py
	cp reports_config.json ./data/raw/
	aws s3 cp reports_config.json s3://waze-reports/weekly/support_files/
    
update-test:
	python update_reports_config.py -t
	aws s3 cp rc_test.json s3://waze-reports/weekly/support_files/