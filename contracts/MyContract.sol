pragma solidity ^0.4.21;

import "zos-lib/contracts/migrations/Migratable.sol";
import "zos-lib/contracts/upgradeability/AdminUpgradeabilityProxy.sol";
import "openzeppelin-zos/contracts/ownership/Ownable.sol";

contract MyContract is Migratable, Ownable {

	uint256 public value;
	function initialize(address owner, uint256 _value) isInitializer("MyContract", "0") public {
		Ownable.initialize(owner);
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
	function selfupdate(address newContract) {
		AdminUpgradeabilityProxy(this).upgradeTo(newContract);
	}
}

contract MyContractV4 is MyContractV3 {
	function mul(uint256 _value) public {
		value = value * _value;
	}
}