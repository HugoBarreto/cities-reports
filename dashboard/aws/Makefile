nothing:
	echo "Be careful"

update-queries:
	aws s3 cp ./templates/ s3://waze-reports/dashboard/support_files/queries --recursive

update-reports-config:
	python update_dashboard_config.py
	aws s3 cp dashboard_config.json s3://waze-reports/dashboard/support_files/

update-test:
	python update_dashboard_config.py -t
	aws s3 cp dash_test.json s3://waze-reports/dashboard/support_files/

update-all: update-test update-reports-config update-queries
