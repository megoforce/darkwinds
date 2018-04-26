pragma solidity ^0.4.21;

import "../DarkWindsFirstEdition.sol";


/**
 * @title ERC721TokenMock
 * This mock just provides a public mint and burn functions for testing purposes,
 * and a public setter for metadata URI
 */
contract DarkWindsFirstEditionTokenMock is DarkWindsFirstEdition {
    function DarkWindsFirstEditionTokenMock(address[] _payees, uint256[] _shares) DarkWindsFirstEdition(_payees, _shares) public
    {

    }

    function mint(address _to, uint256 _tokenId, uint256 _prototypeId) public {
        super._mint(_to, _tokenId, _prototypeId);
    }

    function setMaxCards(uint256 _maxCards) public {
        maxCards = _maxCards;
    }
}
