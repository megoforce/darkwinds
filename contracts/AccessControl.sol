pragma solidity ^0.4.21;


import "./Ownable.sol";
import "./SplitPayment.sol";


/**
 * @title Pausable
 * @dev Base contract which allows children to implement an emergency stop mechanism.
 */
contract AccessControl is Ownable, SplitPayment {
    event Pause();
    event Unpause();

    // The addresses of the accounts (or contracts) that can execute actions within each roles.
    address public megoAddress = 0x4ab6C984E72CbaB4162429721839d72B188010E3;
    address public publisherAddress = 0x00C0bCa70EAaADF21A158141EC7eA699a17D63ed;

    address[] public teamAddresses = [
        0x4978FaF663A3F1A6c74ACCCCBd63294Efec64624,
        0x772009E69B051879E1a5255D9af00723df9A6E04,
        0xA464b05832a72a1a47Ace2Be18635E3a4c9a240A,
        0xd450fCBfbB75CDAeB65693849A6EFF0c2976026F,
        0xd129BBF705dC91F50C5d9B44749507f458a733C8,
        0xfDC2ad68fd1EF5341a442d0E2fC8b974E273AC16,
        0x4ab6C984E72CbaB4162429721839d72B188010E3
    ];


    bool public paused = false;

    /**
     * @dev Modifier to make a function callable only by the contract team
     */
    modifier onlyTeam() {
        require(
            msg.sender == teamAddresses[0] ||
            msg.sender == teamAddresses[1] ||
            msg.sender == teamAddresses[2] ||
            msg.sender == teamAddresses[3] ||
            msg.sender == teamAddresses[4] ||
            msg.sender == teamAddresses[5] ||
            msg.sender == teamAddresses[6]
        );
        _; // do the rest
    }

    /**
     * @dev Modifier to make a function callable only by the publisher
     */
    modifier onlyPublisher() {
        require(msg.sender == publisherAddress);
        _;
    }

    /**
     * @dev Modifier to make a function callable only by the Mego
     */
    modifier onlyMEGO() {
        require(msg.sender == megoAddress);
        _;
    }

    /**
     * @dev Modifier to make a function callable only by the Mego or the Team
     */
    modifier onlyMegoOrTeam() {
        require(
            msg.sender == megoAddress      ||
            msg.sender == teamAddresses[0] ||
            msg.sender == teamAddresses[1] ||
            msg.sender == teamAddresses[2] ||
            msg.sender == teamAddresses[3] ||
            msg.sender == teamAddresses[4] ||
            msg.sender == teamAddresses[5] ||
            msg.sender == teamAddresses[6]
        );
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is not paused.
     */
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /**
     * @dev Modifier to make a function callable only when the contract is paused.
     */
    modifier whenPaused() {
        require(paused);
        _;
    }

    /**
     * @dev called by the owner to pause, triggers stopped state
     */
    function pause() onlyOwner whenNotPaused public {
        paused = true;
        emit Pause();
    }

    /**
     * @dev called by the owner to unpause, returns to normal state
     */
    function unpause() onlyOwner whenPaused public {
        paused = false;
        emit Unpause();
    }
}
