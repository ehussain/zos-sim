'use strict';

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(web3.BigNumber))
  .should()

const { Contracts } = require('zos-lib')

const MyContract = Contracts.getFromLocal('MyContract');
const MyContractV2 = Contracts.getFromLocal('MyContractV2');
const MigratableMockV1 = Contracts.getFromNodeModules('zos-lib', 'MigratableMockV1')
const MigratableMockV2 = Contracts.getFromNodeModules('zos-lib', 'MigratableMockV2')
const MigratableMockV3 = Contracts.getFromNodeModules('zos-lib', 'MigratableMockV3')
const MigratableMock = Contracts.getFromNodeModules('zos-lib', 'MigratableMock')
const DummyImplementation = Contracts.getFromNodeModules('zos-lib', 'DummyImplementation')
const ClashingImplementation = Contracts.getFromNodeModules('zos-lib', 'ClashingImplementation')
const AdminUpgradeabilityProxy = Contracts.getFromNodeModules('zos-lib', 'AdminUpgradeabilityProxy')

contract('AdminUpgradeabilityProxy', ([_, admin, anotherAccount]) => {
  before(async function () {
    this.implementation_v0 = (await DummyImplementation.new()).address
    this.implementation_v1 = (await DummyImplementation.new()).address
    this.myContract = await MyContract.new()
    this.myContractAddress = this.myContract.address;


    this.proxy = await AdminUpgradeabilityProxy.new(this.myContractAddress, { from: admin })
    this.proxyAddress = this.proxy.address;

    const dummy = new MyContract(this.proxyAddress);
    
    await dummy.initialize(100);
    const value1 = await dummy.value();
    console.log(value1);

    await dummy.add(150);
    const value2 = await dummy.value();
    console.log(value2);
  })

  beforeEach(async function () {
    this.proxy = await AdminUpgradeabilityProxy.new(this.myContractAddress, { from: admin })
    this.proxyAddress = this.proxy.address;
  })

  describe('implementation', function () {
    it('returns the current implementation address', async function () {
      const implementation = await this.proxy.implementation({ from: admin })

      implementation.should.be.equal(this.myContractAddress)
    })

    it('delegates to the implementation', async function () {
      const dummy = new MyContract(this.proxyAddress);

      await dummy.initialize(100);
      const value = await dummy.value();

      console.log(value);
    })

    it('should simulate all' , async function() {
      console.log(' - initialize - ');

      var myContract = await MyContract.new()
      console.log('myContract' , myContract.address, admin);
      var myContractProxy = await AdminUpgradeabilityProxy.new(myContract.address, { from: admin })
      var myContractInstance = new MyContract(myContractProxy.address)

      await myContractInstance.initialize(100)
      const value1 = await myContractInstance.value()
      console.log(value1)

      await myContractInstance.add(150)
      const value2 = await myContractInstance.value()
      console.log(value2)

      console.log(' - upgrading - ');

      var myContractV2 = await MyContractV2.new()
      console.log('myContractV2' , myContractV2.address, admin);
      await myContractProxy.upgradeTo(myContractV2.address, { from : admin })
      var myContractV2Instance = new MyContractV2(myContractProxy.address)

      await myContractV2Instance.add(150)
      const value4 = await myContractV2Instance.value()
      console.log(value4) 
      
      await myContractV2Instance.sub(50)
      const value5 = await myContractV2Instance.value()
      console.log(value5)      

    })
  })
}) 