pragma solidity ^0.4.19;

import "./FighterAvatar.sol";

contract FighterHelper is FighterAvatar {

    uint levelUpFee = 0.01 ether;
    uint coolDownTimer = 5 minutes;

    modifier aboveLevel(uint _level, uint fighterId) {
        require(fighters[fighterId].level > _level);
        _;
    }

    function _triggerCoolDownFunction(Fighter storage myFighter) internal {
        myFighter.readyTime = uint32(now + coolDownTimer);
    }

    function _isReady(Fighter storage myFighter) internal view returns (bool) {
        return (myFighter.readyTime < now);
    }

    function winAndCreate(uint _fighterId, uint _dna) public {
        require(fighterToOwner[_fighterId] == msg.sender);
        Fighter storage myFighter = fighters[_fighterId];
        _dna = _dna % fighterDnaModulus;
        uint newDna = (myFighter.dna + _dna) / 2;
        _createFighter(strConcat(myFighter.name," New Fighter"), newDna);
    }

    function changeName(uint _fighterId, string _newName) public aboveLevel(1, _fighterId) {
        fighters[_fighterId].name = _newName;
    }

    function changeDna(uint _fighterId, uint _newDna) public aboveLevel(9, _fighterId) {
        fighters[_fighterId].dna = _newDna;
    }

    function getFightersByOwner(address _owner) external view returns(uint[]) {
        uint[] memory result = new uint[](ownerFighterCount[_owner]);

        uint count = 0;
        for(uint i = 0 ; i < fighters.length ; i++){
            if(fighterToOwner[i] == _owner){
                result[count] = i;
                count++;
            }
        }

        return result;
    }

    function levelUp(uint _fighterId) public payable {
        require(msg.value == levelUpFee);
        fighters[_fighterId].level++;
    }

    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    function changeLevelUpFee(uint _fee) external onlyOwner {
        levelUpFee = _fee;
    }

    // Help functions to concatenate 2 strings
    function strConcat(string _a, string _b, string _c, string _d, string _e) internal pure returns (string) {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        bytes memory _bc = bytes(_c);
        bytes memory _bd = bytes(_d);
        bytes memory _be = bytes(_e);
        string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
        bytes memory babcde = bytes(abcde);
        uint k = 0;
        for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
        for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
        for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
        for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
        for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
        return string(babcde);
    }

    function strConcat(string _a, string _b, string _c, string _d) internal pure returns (string) {
        return strConcat(_a, _b, _c, _d, "");
    }

    function strConcat(string _a, string _b, string _c) internal pure returns (string) {
        return strConcat(_a, _b, _c, "", "");
    }

    function strConcat(string _a, string _b) internal pure returns (string) {
        return strConcat(_a, _b, "", "", "");
    }
}
