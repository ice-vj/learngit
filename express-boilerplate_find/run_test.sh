#! /bin/sh

while [ $# -gt 0 ]
do
    case $1 in
        -p)
            PARALLEL=true ;;
        *)
            TEST_PATHS="$TEST_PATHS ./tests/$1" ;;
    esac
    shift
done

if [ -z "$TEST_PATHS" ]; then
    TEST_PATHS='./tests'
fi

echo "will run tests under $TEST_PATHS..."

if [ "$PARALLEL" ]; then
    echo "will run all tests parallel, show result only"
    find $TEST_PATHS -name "*.test.js" -print0 | xargs -0 -P 20 -n 1 mocha --no-timeouts --reporter mocha-minimalist-reporter
else
    mocha --no-timeouts -b --recursive $TEST_PATHS
fi