pragma solidity ^0.4.18;

import "./CardOwnership.sol";

contract CorsariumCore is CardOwnership {

    uint256 nonce = 1;
    uint256 public cardCost = 1 finney;

    function CorsariumCore(address[] _payees, uint256[] _shares) SplitPayment(_payees, _shares) public {

    }

    // payable fallback
    function () public payable {}

    function changeCardCost(uint256 _newCost) onlyTeam public {
        cardCost = _newCost;
    }

    function getCard(uint _token_id) public view returns (uint256) {
        assert(_token_id <= lastPrintedCard);
        return tokenToCardIndex[_token_id];
    }

    function buyBoosterPack() public payable {
        uint amount = msg.value/cardCost;
        uint blockNumber = block.timestamp;
        for (uint i = 0; i < amount; i++) {
            _createCard(i%5 == 1 ? (uint256(keccak256(i+nonce+blockNumber)) % 50) : (uint256(keccak256(i+nonce+blockNumber)) % 50) + (nonce%50), msg.sender);
        }
        nonce += amount;

    }
    
    function cardsOfOwner(address _owner) external view returns (uint256[] ownerCards) {
        uint256 tokenCount = ownerTokenCount[_owner];

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 resultIndex = 0;

            // We count on the fact that all cards have IDs starting at 1 and increasing
            // sequentially up to the totalCards count.
            uint256 cardId;

            for (cardId = 1; cardId <= lastPrintedCard; cardId++) {
                if (tokenIdToOwner[cardId] == _owner) {
                    result[resultIndex] = cardId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    function tokensOfOwner(address _owner) external view returns (uint256[] ownerCards) {
        uint256 tokenCount = ownerTokenCount[_owner];

        if (tokenCount == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](tokenCount);
            uint256 resultIndex = 0;

            // We count on the fact that all cards have IDs starting at 1 and increasing
            // sequentially up to the totalCards count.
            uint256 cardId;

            for (cardId = 1; cardId <= lastPrintedCard; cardId++) {
                if (tokenIdToOwner[cardId] == _owner) {
                    result[resultIndex] = cardId;
                    resultIndex++;
                }
            }

            return result;
        }
    }

    function cardSupply() external view returns (uint256[] printedCards) {

        if (totalSupply() == 0) {
            // Return an empty array
            return new uint256[](0);
        } else {
            uint256[] memory result = new uint256[](100);
            //uint256 totalCards = 1000000;
            //uint256 resultIndex = 0;

            // We count on the fact that all cards have IDs starting at 1 and increasing
            // sequentially up to 1000000
            uint256 cardId;

            for (cardId = 1; cardId < 1000000; cardId++) {
                result[tokenToCardIndex[cardId]]++;
                //resultIndex++;
            }

            return result;
        }
    }
    
}