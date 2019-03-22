#
#    SPDX-License-Identifier: Apache-2.0
#

kill -9 $(ps -aux  |  grep -v "awk"  |  awk '/name - hyperledger-explorer/ {print $2}')

