'use strict';
global.artifacts = artifacts;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should()
  
const { Contracts } = require('zos-lib')

const MyContract = Contracts.getFromLocal('MyContract');
const MyContractV2 = Contracts.getFromLocal('MyContractV2');
const AdminUpgradeabilityProxy = Contracts.getFromNodeModules('zos-lib', 'AdminUpgradeabilityProxy');

const owner = web3.eth.accounts[0];
const admin = web3.eth.accounts[0];
const accounts = web3.eth.accounts;
console.log(owner, admin);

async function main() {
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
}

module.exports = callback => main()
    .catch(error => console.error("Error running script", error))
    .then(callback);