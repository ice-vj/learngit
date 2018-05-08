<see https://code.iyunxiao.com/peterteam/hfs-ss/blob/a720b9541cbd11d5409654c4182c4036a02b528f/README.md and https://code.iyunxiao.com/peterteam/hfs2-0/blob/86f08d4ab53256f726051b4852193c2fc65cea3c/README.md for examples(all contents inside angle brackets should be replaced or removed)>
# <Project Name>

<Abstract of this project>

## Getting Start

<The steps to deploy, run and test the project in dev env, like follow:>
### run

    npm install
    npm start

### test

    npm test    # after npm start
    npm test -- -p  # run all tests parallel
    npm test -- routes/<some-module> -p # run tests of a module parallel

    npm run coverage    # check coverage, no need to `npm start`
    # send SIGINT after testing
    # Cmd-C
    npm run report  # open coverage report

## docker[Optional]

    docker build -t <Project Name> .        # build docker image
    docker run -d -p 9999:9999 <Image Name> # run service container
    curl localhost:9999/healthcheck         # test service status

## Deploy Test Env

<The steps to deploy the project in test env>

## Deploy Prod Env

<The steps to deploy the project in prod env>

<Add `Attentions`, `Dependencies` and other sections if need>