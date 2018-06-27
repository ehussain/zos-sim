pragma solidity ^0.4.21;

import "zos-lib/contracts/migrations/Migratable.sol";
import "zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol";

contract MyContract is Migratable {

	uint256 public value;
	function initialize(uint256 _value) isInitializer("MyContract", "0") public {
		value = _value;
	}

	function add(uint256 _value) public {
		value = value + _value;
	}
}

contract MyContractV2 is MyContract {
	function sub(uint256 _value) public {
		value = value - _value;
	}
}

contract MyContractV3 is MyContractV2 {
	function upgrade(address newContract) {
		AdminUpgradeabilityProxy(this).upgradeTo(newContract);
	}
}

contract MyContractV4 is MyContractV3 {
	function mul(uint256 _value) public {
		value = value * _value;
	}
}