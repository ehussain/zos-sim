'use strict';
global.artifacts = artifacts;

const { Contracts } = require('zos-lib')

const MyContract = Contracts.getFromLocal('MyContract');
const MyContractV2 = Contracts.getFromLocal('MyContractV2');
const AdminUpgradeabilityProxy = Contracts.getFromNodeModules('zos-lib', 'AdminUpgradeabilityProxy');

const owner = web3.eth.accounts[0];
const admin = web3.eth.accounts[0];
const accounts = web3.eth.accounts;
console.log(owner, admin);

module.exports = async function() {
	// console.log('Deploying MyContract...');
	// var myContract = await MyContract.new({from: owner});
	// console.log('MyContract : ' , myContract.address);

	// var implementation_v0 = (await DummyImplementation.new()).address

	// console.log('Deploying a proxy pointing to...');
	// var proxy = await AdminUpgradeabilityProxy.new(implementation_v0, { from: owner })
 //    var proxyAddress = proxy.address;
	// console.log('AdminUpgradeabilityProxy : ' , proxy.address);

	// console.log('Checking implementation...');
	// var implementation = await proxy.implementation.call();
	// console.log('implementation : ' , implementation);

	// console.log('Checking admin...');
	// var admin = await proxy.admin.call();
	// console.log('admin : ' , admin);

	// const dummy = new DummyImplementation(proxyAddress);
	// console.log('dummy' , dummy);
 //    const value = await dummy.get();
 //    console.log('dummy value' , value);


	// try {
	// 	console.log('Calling initialize(42) on proxy...');
	// 	myContract = new MyContract(proxy.address);
	// 	console.log(myContract);

	// 	const value = 42;
	// 	// await myContract.initialize(value , {from: owner});
	// 	console.log('Proxy\'s storage value: ' , await myContract.value());	
	// } catch(e) {
	// 	console.log('------- exception -------');
	// 	console.log(e);
	// 	console.log('------- --------- -------');
	// }

	console.log(' - initialize - ');

	var myContract = await MyContract.new()
	console.log('myContract' , myContract.address, admin);
	var myContractProxy = await AdminUpgradeabilityProxy.new(myContract.address, { from: admin })
	var myContractInstance = new MyContract(myContractProxy.address)

	console.log('myContract initialize');
	await myContractInstance.initialize(100)
	const value1 = await myContractInstance.value()
	console.log(value1)

	console.log('myContract add');
	await myContractInstance.add(150)
	const value2 = await myContractInstance.value()
	console.log(value2)

	console.log(' - upgrading - ');

	var myContractV2 = await MyContractV2.new()
	console.log('myContractV2' , myContractV2.address, admin);
	await myContractProxy.upgradeTo(myContractV2.address, { from : admin })
	var myContractV2Instance = new MyContractV2(myContractProxy.address)

	console.log('myContractV2 add');
	await myContractV2Instance.add(150)
	const value4 = await myContractV2Instance.value()
	console.log(value4) 

	console.log('myContractV2 sub');
	await myContractV2Instance.sub(50)
	const value5 = await myContractV2Instance.value()
	console.log(value5)      
};