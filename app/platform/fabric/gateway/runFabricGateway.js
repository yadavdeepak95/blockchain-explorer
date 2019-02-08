const FabricGateway = require('./FabricGateway');

// this is for the running purposes, will be removed from the project

//gateway.enrollAdminUser();
// how to start fabcar https://hyperledger-fabric.readthedocs.io/en/release-1.4/write_first_app.html

/*
const fabCarPath= './connection-profile/fabrcar-connection.json';
const fbGateway = new FabricGateway(fabCarPath, 'admin', 'adminpw');
fbGateway.initialize();

*/
/*

console.log('\n\n\n\n\n\BALANCE TRANSFER NETWORK \n\n\n\n')

const balance_transfer_connection = './connection-profile/balance-transfer-connection.json';
const btGateway = new FabricGateway(balance_transfer_connection, 'admin', 'adminpw');
btGateway.initialize();

*/

console.log('\n\n\n\n\nRUNNING FIRST NETWORK \n\n\n\n');
const firstNetwork = './connection-profile/first-network-connection.json';
const fnGateway = new FabricGateway(firstNetwork, 'admin', 'adminpw');
fnGateway.initialize();
