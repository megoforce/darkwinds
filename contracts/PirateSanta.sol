pragma solidity ^0.5;

import "./Lockable.sol";
import "./ERC721Holder.sol";
import "./DarkWindsFirstEdition.sol";

contract PirateSanta is Lockable, ERC721Holder {

    mapping(address => bool) internal secretSantaToDonated;
    address[] internal santas;
    uint256[] public gifts;
    uint256 internal nonce = 0;
    bool internal shuffled = false;
    DarkWindsFirstEdition dw;
    uint256 internal date;

    constructor(address payable add, uint256 d) public {
        dw = DarkWindsFirstEdition(add);
        date = d;
    }
     

    function () external payable {
        revert("no money dude");
    }

    function onERC721Received(address _from, uint256 _tokenId, bytes memory _data) public whenNotLocked returns (bytes4) {
        nonce += 1;
        require(secretSantaToDonated[_from] == false, "sending gift again");
        secretSantaToDonated[_from] = true;
        santas.push(_from);
        gifts.push(_tokenId);

        return ERC721_RECEIVED;
    }

    function getGift(address santa) public view whenNotLocked returns (uint256 gift) {
        //require(shuffled == true, "not shuffled");
        require(secretSantaToDonated[santa] == true, "didnt donate");
        
        for (uint256 i = 0; i < gifts.length; i++) {
            if (santas[i] == santa) {
                gift = gifts[i];
                break;
            }
        }

        return gift;
    }

    function claimGift() public whenNotLocked { 
        require(shuffled == true, "not shuffled");
        require(secretSantaToDonated[msg.sender] == true, "didnt donate");
        
        for (uint256 i = 0; i < gifts.length; i++) {
            if (santas[i] == msg.sender) {
                dw.safeTransferFrom(address(this), address(msg.sender), gifts[i]);
                break;
            }
        }
    }

    function shuffle() public onlyOwner whenNotLocked {
        require(now > date , "do they know is christmas"); //1545696000 == 25 dic 00:00 utc
        for (uint256 j = 0; j < gifts.length; j++) {
            uint256 i = gifts.length - j - 1;
            uint256 random = uint256(keccak256(abi.encodePacked(now, nonce, i, gifts.length))) % gifts.length;
            uint256 gift = gifts[random];
            gifts[random] = gifts[i];
            gifts[i] = gift;
        }

        shuffled = true;
    }

}
