pragma solidity ^0.4.18;

import "./SplitPayment.sol";

contract CorsariumAccessControl is SplitPayment {
//contract CorsariumAccessControl {
   
    event ContractUpgrade(address newContract);

    // The addresses of the accounts (or contracts) that can execute actions within each roles.
    address public megoAddress = 0x4ab6C984E72CbaB4162429721839d72B188010E3;
    address public publisherAddress = 0x00C0bCa70EAaADF21A158141EC7eA699a17D63ed;
    address[] public teamAddresses = [0x4978FaF663A3F1A6c74ACCCCBd63294Efec64624, 0x772009E69B051879E1a5255D9af00723df9A6E04, 0xA464b05832a72a1a47Ace2Be18635E3a4c9a240A, 0xd450fCBfbB75CDAeB65693849A6EFF0c2976026F, 0xd129BBF705dC91F50C5d9B44749507f458a733C8, 0xfDC2ad68fd1EF5341a442d0E2fC8b974E273AC16, 0x4ab6C984E72CbaB4162429721839d72B188010E3];
    // todo: add addresses of creators

    // @dev Keeps track whether the contract is paused. When that is true, most actions are blocked
    bool public paused = false;

    modifier onlyTeam() {
        require(msg.sender == teamAddresses[0] || msg.sender == teamAddresses[1] || msg.sender == teamAddresses[2] || msg.sender == teamAddresses[3] || msg.sender == teamAddresses[4] || msg.sender == teamAddresses[5] || msg.sender == teamAddresses[6] || msg.sender == teamAddresses[7]);
        _; // do the rest
    }

    modifier onlyPublisher() {
        require(msg.sender == publisherAddress);
        _;
    }

    modifier onlyMEGO() {
        require(msg.sender == megoAddress);
        _;
    }

    /*** Pausable functionality adapted from OpenZeppelin ***/

    /// @dev Modifier to allow actions only when the contract IS NOT paused
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    /// @dev Modifier to allow actions only when the contract IS paused
    modifier whenPaused {
        require(paused);
        _;
    }

    function CorsariumAccessControl() public {
        megoAddress = msg.sender;
    }

    /// @dev Called by any team member to pause the contract. Used only when
    ///  a bug or exploit is detected and we need to limit damage.
    function pause() external onlyTeam whenNotPaused {
        paused = true;
    }

    /// @dev Unpauses the smart contract. Can only be called by MEGO, since
    ///  one reason we may pause the contract is when team accounts are
    ///  compromised.
    /// @notice This is public rather than external so it can be called by
    ///  derived contracts.
    function unpause() public onlyMEGO whenPaused {
        // can't unpause if contract was upgraded
        paused = false;
    }

}
