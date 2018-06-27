'use strict';
global.artifacts = artifacts;

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should()
  
const { Contracts } = require('zos-lib')

const MyContract = Contracts.getFromLocal('MyContract');
const MyContractV2 = Contracts.getFromLocal('MyContractV2');
const MyContractV3 = Contracts.getFromLocal('MyContractV3');
const MyContractV4 = Contracts.getFromLocal('MyContractV4');

const AdminUpgradeabilityProxy = Contracts.getFromNodeModules('zos-lib', 'AdminUpgradeabilityProxy');

const owner = web3.eth.accounts[1];
const admin = web3.eth.accounts[2];
const accounts = web3.eth.accounts;
console.log(owner, admin);

async function main() {
	console.log(' - initialize - ');

	var myContract = await MyContract.new()
	console.log('myContract' , myContract.address, admin);
	var myContractProxy = await AdminUpgradeabilityProxy.new(myContract.address, { from: admin })
	var myContractInstance = MyContract.at(myContractProxy.address)

	console.log('myContract initialize');
	console.log(owner, 100);
	await myContractInstance.initialize(owner, 100, {from: owner})

	const _owner = await myContractInstance.owner.call()
	console.log(_owner);

	// const value1 = await myContractInstance.value()
	// console.log(value1.toString(10));

	// console.log('myContract add');
	// await myContractInstance.add(150)
	// const value2 = await myContractInstance.value()
	// console.log(value2.toString(10));

	// console.log(' - upgrading v3 - ');

	// var myContractV2 = await MyContractV2.new()
	// console.log('myContractV2' , myContractV2.address, admin);
	// await myContractProxy.upgradeTo(myContractV2.address, { from : admin })
	// var myContractV2Instance = MyContractV2.at(myContractProxy.address)

	// console.log('myContractV2 add');
	// await myContractV2Instance.add(150)
	// const value4 = await myContractV2Instance.value()
	// console.log(value4.toString(10)); 

	// console.log('myContractV2 sub');
	// await myContractV2Instance.sub(50)
	// const value5 = await myContractV2Instance.value()
	// console.log(value5.toString(10));      

	// console.log(' - upgrading v3 - ');

	// var myContractV3 = await MyContractV3.new()
	// console.log('myContractV3' , myContractV3.address, admin);
	// await myContractProxy.upgradeTo(myContractV3.address, { from : admin })
	// var myContractV3Instance = new MyContractV3(myContractProxy.address)

	// await myContractV3Instance.add(150)
	// const value6 = await myContractV3Instance.value()
	// console.log(value6.toString(10)); 

	// await myContractV3Instance.sub(50)
	// const value7 = await myContractV3Instance.value()

	// console.log('admin : old' , await myContractProxy.admin.call({from: admin}));
	// var contractAddress = myContractProxy.address;

	// console.log('proxy : ' , myContractProxy.address);
	// console.log('contractAddress : ' , contractAddress);
	// await myContractProxy.changeAdmin(contractAddress , {from: admin});
	// console.log('admin : new' , await myContractProxy.admin.call({from: myContractProxy.address}));

	// var myContractV4 = await MyContractV4.new()
	// console.log('myContractV4' , myContractV4.address, admin);
	// await myContractV3Instance.selfupdate(myContractV4.address)
	// var myContractV4Instance = new MyContractV4(myContractProxy.address)

	// await myContractV4Instance.add(150)
	// const value8 = await myContractV4Instance.value()
	// console.log(value8.toString(10));

	// await myContractV4Instance.sub(50)
	// const value9 = await myContractV4Instance.value()

	// await myContractV4Instance.mul(5)
	// const value10 = await myContractV4Instance.value()
	// console.log('value10' , value10.toString(10));
}

module.exports = callback => main()
    .catch(error => console.error("Error running script", error))
    .then(callback);