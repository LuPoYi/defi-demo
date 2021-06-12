pragma solidity ^0.5.0;

import "./BobToken.sol";
import "./AirToken.sol";

contract PublicSale {
    struct Game {
        address starterAddress;
        address challengerAddress;
        uint256 staterPoint;
        uint256 challengerPoint;
        bool isStarterWin;
        bool isFinished;
    }

    string public name = "Bob Token Farm";
    uint256 public gameID;
    address public owner;
    BobToken public bobToken;
    AirToken public airToken;

    mapping(address => bool) public hasClaimBob;
    mapping(uint256 => Game) public games;

    constructor(BobToken _bobToken, AirToken _airToken) public {
        bobToken = _bobToken;
        airToken = _airToken;
        owner = msg.sender;
    }

    // pay 100 BOB to start game
    function startGame(uint256 _amount) public {
        bobToken.transferFrom(msg.sender, address(this), _amount);
        gameID++;

        games[gameID].starterAddress = msg.sender;
    }

    // pay 100 BOB to join game
    function joinGame(uint256 _gameID, uint256 _amount) public {
        require(!games[_gameID].isFinished, "the game has finished");

        uint256 staterPoint;
        uint256 challengerPoint;
        bool isStarterWin;

        bobToken.transferFrom(msg.sender, address(this), _amount);
        staterPoint = random(games[_gameID].starterAddress);
        challengerPoint = random(msg.sender);
        isStarterWin = staterPoint >= challengerPoint;

        games[_gameID].challengerAddress = msg.sender;
        games[_gameID].staterPoint = staterPoint;
        games[_gameID].challengerPoint = challengerPoint;
        games[_gameID].isStarterWin = isStarterWin;
        games[_gameID].isFinished = true;

        if (isStarterWin) {
            bobToken.transfer(
                games[_gameID].starterAddress,
                100000000000000000000
            );
        } else {
            bobToken.transfer(msg.sender, 100000000000000000000);
        }
    }

    function random(address _address) private view returns (uint256) {
        uint256 seed =
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.timestamp +
                            block.difficulty +
                            ((
                                uint256(
                                    keccak256(abi.encodePacked(block.coinbase))
                                )
                            ) / (now)) +
                            block.gaslimit +
                            ((uint256(keccak256(abi.encodePacked(_address)))) /
                                (now)) +
                            block.number
                    )
                )
            );

        return (seed - ((seed / 1000) * 1000));
    }

    // claim bob 100
    function claimBobToken() public {
        require(!hasClaimBob[msg.sender], "cannot claim second time");
        bobToken.transfer(msg.sender, 100000000000000000000); // 100
        hasClaimBob[msg.sender] = true;
    }

    // claim air
    function claimAirToken() public {
        airToken.transfer(msg.sender, 10000000000000000000000); // 10,000
    }

    // buy (AIR purchase to BOB) 1 BOB = 100 AIR
    function purchaseToken(uint256 _amount) public {
        require(_amount > 0, "amount cannot be 0");
        require(
            _amount < 10000000000000000000000,
            "amount cannot bigger than 10,000"
        );

        airToken.transferFrom(msg.sender, address(this), _amount);
        bobToken.transfer(msg.sender, _amount * 100);
    }
}
