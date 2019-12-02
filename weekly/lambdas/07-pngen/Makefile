docker-run:
	sudo docker-compose run --rm lambda index.handler '{"bucket": "waze-reports", "city":"Miraflores","task": {"KeplerHTML": "test/kepler.gl.html", "dataset_key": "test/datasets.js", "config_key": "test/mapConfig.js", "png_key": "test/kepler.png"}}'
    
docker-build:
	sudo docker-compose build --no-cache

clean:
	rm -rf build build.zip
	rm -rf __pycache__
	rm -rf bin

fetch-dependencies:
	mkdir -p bin/

	# Get chromedriver
	curl -SL https://chromedriver.storage.googleapis.com/2.37/chromedriver_linux64.zip > chromedriver.zip
	unzip chromedriver.zip -d bin/

	# Get Headless-chrome
	curl -SL https://github.com/adieuadieu/serverless-chrome/releases/download/v1.0.0-37/stable-headless-chromium-amazonlinux-2017-03.zip > headless-chromium.zip
	unzip headless-chromium.zip -d bin/

	# Clean
	rm headless-chromium.zip chromedriver.zip

build-lambda-package:
	rm -rf build build.zip
	mkdir build
	cp -r src build/.
	cp -r bin build/.
	cp -r lib build/.
	pip install -r requirements.txt -t build/lib/.

upload-lambda:
	cd build; zip -9qr pngen.zip .
	cp build/pngen.zip .
	aws s3 cp pngen.zip s3://waze-reports/packages/
	aws lambda update-function-code --function-name arn:aws:lambda:us-east-2:697036326133:function:pngen --s3-bucket waze-reports --s3-key packages/pngen.zip
    