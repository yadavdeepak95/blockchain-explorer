#!/bin/bash

set -e

# Print usage
function print_help() {
	echo "Usage: "
	echo "    main.sh <mode> [-v]"
	echo "        <mode> - one of 'install', 'test' or 'clean'"
	echo "            - 'install' - install all dependencies of the project"
	echo "            - 'test' - run unit tests of the application and client code"
	echo "            - 'clean' - clean the project directory of installed dependencies"
	echo "        -v,   --verbose - enable verbose output)"
	echo "    main.sh -h, --help (print this message)"
}

function do_install() {
	VERBOSE=${VERBOSE:+-ddd}
	npm install $VERBOSE
	(cd app/test && npm install $VERBOSE)
	(cd client && npm install $VERBOSE && npm run build)
}

function do_test() {
	(cd app/test && npm run test)
	(cd client && npm test -u --coverage)
}

function do_clean() {
	rm -rf node_modules
	rm -rf client/node_modules client/build client/coverage
	rm -rf app/test/node_modules
}

# Get subcommand
SUBCOMMAND=$1
shift

case $SUBCOMMAND in
	install | test | clean)
		;;
	*)
		print_help
		exit 1
		;;
esac

OPTIONS="hv"
LONGOPTIONS="help,verbose"

# TODO: Can pass the same option (short or long) multiple times - last one is committed
PARSED_OPTS=$(getopt --options=$OPTIONS --longoptions=$LONGOPTIONS --name "$0" -- "$@")
if [[ $? -ne 0 ]]; then
	exit 1
fi

eval set -- "$PARSED_OPTS"

echo $@

VERBOSE=
while true; do
	case $1 in
		-v | --verbose)
			VERBOSE=true
			shift
			;;
		-h | --help)
			print_help
			exit 1
			;;
		--)
			shift
			if [[ $1 = "" ]]; then
				break
			else
				echo "Unrecognized option: $1"
				exit 2
			fi
			;;
		*)
			echo "Logic Error"
			exit 3
			;;
	esac
done

case $SUBCOMMAND in
	install)
		do_install
		;;
	test)
		do_test
		;;
	clean)
		do_clean
		;;
	*)
		echo "Logic Error"
		exit 3
		;;
esac
