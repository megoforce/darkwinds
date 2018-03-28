pragma solidity ^0.4.18;

import "./CardBase.sol";

/// @dev Note: the ERC-165 identifier for this interface is 0xf0b9e5ba
interface ERC721TokenReceiver {
    /// @notice Handle the receipt of an NFT
    /// @dev The ERC721 smart contract calls this function on the recipient
    ///  after a `transfer`. This function MAY throw to revert and reject the
    ///  transfer. This function MUST use 50,000 gas or less. Return of other
    ///  than the magic value MUST result in the transaction being reverted.
    ///  Note: the contract address is always the message sender.
    /// @param _from The sending address 
    /// @param _tokenId The NFT identifier which is being transfered
    /// @param data Additional data with no specified format
    /// @return `bytes4(keccak256("onERC721Received(address,uint256,bytes)"))`
    ///  unless throwing
	function onERC721Received(address _from, uint256 _tokenId, bytes data) external returns(bytes4);
}

contract CardOwnership is CardBase {
    /// @notice Count all NFTs assigned to an owner
    /// @dev NFTs assigned to the zero address are considered invalid, and this
    ///  function throws for queries about the zero address.
    /// @param _owner An address for whom to query the balance
    /// @return The number of NFTs owned by `_owner`, possibly zero
    function balanceOf(address _owner) external view returns (uint256) {
        require(_owner != address(0));
        return ownerTokenCount[_owner];
    }

    /// @notice Find the owner of an NFT
    /// @param _tokenId The identifier for an NFT
    /// @dev NFTs assigned to zero address are considered invalid, and queries
    ///  about them do throw.
    /// @return The address of the owner of the NFT
    function ownerOf(uint256 _tokenId) external view returns (address _owner) {
        _owner = tokenIdToOwner[_tokenId];
        require(_owner != address(0));
    }

    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT. When transfer is complete, this function
    ///  checks if `_to` is a smart contract (code size > 0). If so, it calls
    ///  `onERC721Received` on `_to` and throws if the return value is not
    ///  `bytes4(keccak256("onERC721Received(address,uint256,bytes)"))`.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    /// @param data Additional data with no specified format, sent in call to `_to`
    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes data) external payable {
        require(_getApproved(_tokenId) == msg.sender);
        require(_ownerOf(_tokenId) == _from);
        require(_to != address(0));

        _clearApprovalAndTransfer(_from, _to, _tokenId);

        Approval(_from, 0, _tokenId);
        Transfer(_from, _to, _tokenId);

        if (isContract(_to)) {
            bytes4 value = ERC721TokenReceiver(_to).onERC721Received(_from, _tokenId, data);

            if (value != bytes4(keccak256("onERC721Received(address,uint256,bytes)"))) {
                revert();
            }
        }
    }
	
    /// @notice Transfers the ownership of an NFT from one address to another address
    /// @dev This works identically to the other function with an extra data parameter,
    ///  except this function just sets data to ""
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function safeTransferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require(_getApproved(_tokenId) == msg.sender);
        require(_ownerOf(_tokenId) == _from);
        require(_to != address(0));

        _clearApprovalAndTransfer(_from, _to, _tokenId);

        Approval(_from, 0, _tokenId);
        Transfer(_from, _to, _tokenId);

        if (isContract(_to)) {
            bytes4 value = ERC721TokenReceiver(_to).onERC721Received(_from, _tokenId, "");

            if (value != bytes4(keccak256("onERC721Received(address,uint256,bytes)"))) {
                revert();
            }
        }
    }

    /// @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    ///  TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    ///  THEY MAY BE PERMANENTLY LOST
    /// @dev Throws unless `msg.sender` is the current owner, an authorized
    ///  operator, or the approved address for this NFT. Throws if `_from` is
    ///  not the current owner. Throws if `_to` is the zero address. Throws if
    ///  `_tokenId` is not a valid NFT.
    /// @param _from The current owner of the NFT
    /// @param _to The new owner
    /// @param _tokenId The NFT to transfer
    function transferFrom(address _from, address _to, uint256 _tokenId) external payable {
        require(_getApproved(_tokenId) == msg.sender);
        require(_ownerOf(_tokenId) == _from);
        require(_to != address(0));

        _clearApprovalAndTransfer(_from, _to, _tokenId);

        Approval(_from, 0, _tokenId);
        Transfer(_from, _to, _tokenId);
    }

    /// @notice Set or reaffirm the approved address for an NFT
    /// @dev The zero address indicates there is no approved address.
    /// @dev Throws unless `msg.sender` is the current NFT owner, or an authorized
    ///  operator of the current owner.
    /// @param _approved The new approved NFT controller
    /// @param _tokenId The NFT to approve
    function approve(address _approved, uint256 _tokenId) external payable {
        require(msg.sender == _ownerOf(_tokenId));
        require(msg.sender != _approved);
        
        if (_getApproved(_tokenId) != address(0) || _approved != address(0)) {
            _approve(_approved, _tokenId);
            Approval(msg.sender, _approved, _tokenId);
        }
    }

    /// @notice Enable or disable approval for a third party ("operator") to manage
    ///  all your assets.
    /// @dev Throws unless `msg.sender` is the current NFT owner.
    /// @dev Emits the ApprovalForAll event
    /// @param _operator Address to add to the set of authorized operators.
    /// @param _approved True if the operators is approved, false to revoke approval
    function setApprovalForAll(address _operator, bool _approved) external {
        revert();
    }

    /// @notice Get the approved address for a single NFT
    /// @dev Throws if `_tokenId` is not a valid NFT
    /// @param _tokenId The NFT to find the approved address for
    /// @return The approved address for this NFT, or the zero address if there is none
    function getApproved(uint256 _tokenId) external view returns (address) {
        return _getApproved(_tokenId);
    }

    /// @notice Query if an address is an authorized operator for another address
    /// @param _owner The address that owns the NFTs
    /// @param _operator The address that acts on behalf of the owner
    /// @return True if `_operator` is an approved operator for `_owner`, false otherwise
    function isApprovedForAll(address _owner, address _operator) external view returns (bool) {
        return _owner == _operator;
    }

    /// @notice A descriptive name for a collection of NFTs in this contract
    function name() external pure returns (string _name) {
        return "Dark Winds First Edition Cards";
    }

    /// @notice An abbreviated name for NFTs in this contract
    function symbol() external pure returns (string _symbol) {
        return "DW1ST";
    }

    /// @notice A distinct Uniform Resource Identifier (URI) for a given asset.
    /// @dev Throws if `_tokenId` is not a valid NFT. URIs are defined in RFC
    ///  3986. The URI may point to a JSON file that conforms to the "ERC721
    ///  Metadata JSON Schema".
    function tokenURI(uint256 _tokenId) external view returns (string _tokenURI) {
        _tokenURI = "https://corsarium.playdarkwinds.com/cards/00000.json"; //37 36 35 34 33
        bytes memory tokenUriBytes = bytes(_tokenURI);
        tokenUriBytes[33] = byte(48 + (tokenToCardIndex[_tokenId] / 10000) % 10);
        tokenUriBytes[34] = byte(48 + (tokenToCardIndex[_tokenId] / 1000) % 10);
        tokenUriBytes[35] = byte(48 + (tokenToCardIndex[_tokenId] / 100) % 10);
        tokenUriBytes[36] = byte(48 + (tokenToCardIndex[_tokenId] / 10) % 10);
        tokenUriBytes[37] = byte(48 + (tokenToCardIndex[_tokenId] / 1) % 10);
    }

    function totalSupply() public view returns (uint256 _total) {
        _total = lastPrintedCard;
    }

    function isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly { 
            size := extcodesize(_addr)
        }
        return size > 0;
    }
}