pragma solidity ^0.4.19;
import "./FighterHelper.sol";

contract FighterAttack is FighterHelper {

    uint randNonce;
    uint attackingProbability = 70;

    function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
    }

    function attack(uint _fighterId, uint _targetId) external {
        require(msg.sender == fighterToOwner[_fighterId] && _fighterId != _targetId && _isReady(fighters[_fighterId]));
        uint rand;
        Fighter storage myFighter = fighters[_fighterId];
        Fighter storage enemyFighter = fighters[_targetId];

        rand = randMod(100);

        // win
        if (rand < attackingProbability) {
            myFighter.winCount ++;
            myFighter.level++;
            enemyFighter.lossCount++;
            winAndCreate(_fighterId, enemyFighter.dna);

        // loss
        } else {
            myFighter.lossCount++;
            enemyFighter.winCount++;
        }

        _triggerCoolDownFunction(myFighter);
    }
}
