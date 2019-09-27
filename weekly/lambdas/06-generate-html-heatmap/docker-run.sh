cat eventin.json | sudo docker run --rm \
    -v "$PWD"/src:/var/task \
    -v "$PWD"/opt:/opt \
    -i -e DOCKER_LAMBDA_USE_STDIN=1 \
    --env-file ~/.aws/docker_credentials \
    lambci/lambda:python3.6 generate_js_files.lambda_handler

