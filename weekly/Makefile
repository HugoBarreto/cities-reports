nothing:
	echo "Be careful"

upload-queries:
	aws s3 cp ./templates/queries s3://waze-reports/weekly/support_files/queries --recursive

update-html-templates:
	cp ./notebooks/report/report.html ./templates/html/
	cp ./notebooks/report/table_template.html ./templates/html/

upload-html-templates:
	aws s3 cp ./notebooks/report/report.html s3://waze-reports/weekly/support_files/html/
	aws s3 cp ./notebooks/report/table_template.html s3://waze-reports/weekly/support_files/html/

update-css:
	cp ./notebooks/report/report.css ./templates/css/

uplaod-css:
	aws s3 cp ./notebooks/report/report.css s3://waze-reports/weekly/support_files/css/

