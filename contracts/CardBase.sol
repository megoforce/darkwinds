pragma solidity ^0.4.18;

import "./ERC721.sol";
import "./ERC721Metadata.sol";
import "./CorsariumAccessControl.sol";

contract CardBase is CorsariumAccessControl, ERC721, ERC721Metadata {

    /*** EVENTS ***/

    /// @dev The Print event is fired whenever a new card comes into existence.
    event Print(address owner, uint256 cardId);
    
    uint256 lastPrintedCard = 0;
     
    mapping (uint256 => address) public tokenIdToOwner;  // 721 tokenIdToOwner
    mapping (address => uint256) public ownerTokenCount; // 721 ownerTokenCount
    mapping (uint256 => address) public tokenIdToApproved; // 721 tokenIdToApprovedAddress
    mapping (uint256 => uint256) public tokenToCardIndex; // 721 tokenIdToMetadata
    //mapping (uint256 => uint256) public tokenCountIndex;
    //mapping (address => uint256[]) internal ownerToTokensOwned;
    //mapping (uint256 => uint256) internal tokenIdToOwnerArrayIndex;

    /// @dev Assigns ownership of a specific card to an address.
    /*function _transfer(address _from, address _to, uint256 _tokenId) internal {
      
        ownershipTokenCount[_to]++;
        // transfer ownership
        cardIndexToOwner[_tokenId] = _to;
       
        // Emit the transfer event.
        Transfer(_from, _to, _tokenId);
        
    }*/
    
    function _createCard(uint256 _prototypeId, address _owner) internal returns (uint) {

        // This will assign ownership, and also emit the Transfer event as
        // per ERC721 draft
        require(uint256(1000000) > lastPrintedCard);
        lastPrintedCard++;
        tokenToCardIndex[lastPrintedCard] = _prototypeId;
        _setTokenOwner(lastPrintedCard, _owner);
        //_addTokenToOwnersList(_owner, lastPrintedCard);
        Transfer(0, _owner, lastPrintedCard);
        //tokenCountIndex[_prototypeId]++;
        
        //_transfer(0, _owner, lastPrintedCard); //<-- asd
        

        return lastPrintedCard;
    }

    function _clearApprovalAndTransfer(address _from, address _to, uint _tokenId) internal {
        _clearTokenApproval(_tokenId);
        //_removeTokenFromOwnersList(_from, _tokenId);
        ownerTokenCount[_from]--;
        _setTokenOwner(_tokenId, _to);
        //_addTokenToOwnersList(_to, _tokenId);
    }

    function _ownerOf(uint _tokenId) internal view returns (address _owner) {
        return tokenIdToOwner[_tokenId];
    }

    function _approve(address _to, uint _tokenId) internal {
        tokenIdToApproved[_tokenId] = _to;
    }

    function _getApproved(uint _tokenId) internal view returns (address _approved) {
        return tokenIdToApproved[_tokenId];
    }

    function _clearTokenApproval(uint _tokenId) internal {
        tokenIdToApproved[_tokenId] = address(0);
    }

    function _setTokenOwner(uint _tokenId, address _owner) internal {
        tokenIdToOwner[_tokenId] = _owner;
        ownerTokenCount[_owner]++;
    }

}