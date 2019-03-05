pragma solidity ^0.4.19;
import "./Ownable.sol";

contract FighterAvatar is Ownable {
    uint fighterDna = 16;
    uint fighterDnaModulus = 10 ** 16;

    struct Fighter {
        string name;
        uint dna;
        uint32 level;
        uint32 readyTime;
        uint16 winCount;
        uint16 lossCount;
    }

    Fighter[] public fighters;

    event fighterCreated(string name, uint skill);

    mapping (uint => address) public fighterToOwner;
    mapping (address => uint) ownerFighterCount;

    function _createFighter(string _name, uint _dna) internal {
        uint id = fighters.push(Fighter(_name, _dna, 1, uint32(now), 0, 0)) -1;
        fighterToOwner[id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit fighterCreated(_name, _dna);
    }

    function _generateRandomDna(string _name) private view returns(uint){
        uint dna = uint(keccak256(_name));
        return dna % fighterDnaModulus;
    }

    function generateRandomFighter(string _name) public {
        require(ownerFighterCount[msg.sender] == 0);
        uint dna = _generateRandomDna(_name);
        _createFighter(_name,dna);
    }

    function getOwnerFighterCount() public view returns(uint) {
        return ownerFighterCount[msg.sender];
    }

    function totalFighters() public view returns(uint) {
        return fighters.length;
    }

}
