pragma solidity ^0.4.21;

import "../Lockable.sol";

contract LockableMock is Lockable {
    uint256 public count;

    function LockableMock() public {
        count = 0;
    }

    function normalProcess() external whenNotLocked {
        count++;
    }
}
