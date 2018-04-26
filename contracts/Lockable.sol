pragma solidity ^0.4.21;

import "./Ownable.sol";

contract Lockable is Ownable {

    event Locked();

    bool public locked = false;

    /**
     * @dev Modifier to make a function callable only when function is not locked.
     */
    modifier whenNotLocked() {
        require(!locked);
        _;
    }

    /**
     * @dev called by the owner to lock a function, triggers locked state
     */
    function lock() onlyOwner whenNotLocked public {
        locked = true;
        emit Locked();
    }
}
