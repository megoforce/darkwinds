pragma solidity ^0.4.21;


import "../AccessControl.sol";


// mock class using Pausable
contract PausableMock is AccessControl {
  bool public drasticMeasureTaken;
  uint256 public count;

  function PausableMock(address[] _payees, uint256[] _shares) SplitPayment(_payees, _shares) public {
    drasticMeasureTaken = false;
    count = 0;
  }

  function normalProcess() external whenNotPaused {
    count++;
  }

  function drasticMeasure() external whenPaused {
    drasticMeasureTaken = true;
  }

}
