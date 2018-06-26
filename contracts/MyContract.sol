pragma solidity ^0.4.21;

import "zos-lib/contracts/migrations/Initializable.sol";

contract MyContract is Initializable {

	uint256 public value;
	function initialize(uint256 _value) isInitializer public {
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