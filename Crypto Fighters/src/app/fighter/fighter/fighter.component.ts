import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../providers/web3.service';

@Component({
  selector: 'app-fighter',
  templateUrl: './fighter.component.html',
  styleUrls: ['./fighter.component.css']
})
export class FighterComponent implements OnInit {

  public name: string;
  public dna: string;
  public level: string;
  public readyTime: string;
  public winCount: string;
  public lossCount: string;
  public topText: string;
  public topText2: string;
  public myFighterId: number;
  public fighterCount: number;

  public allFighters: any[] = [];
  public uiFighterArray: any[] = [];

  constructor(private web3: Web3Service) { }

  ngOnInit() {
      this.getAccount();
    }

  getAccount() {
    return this.web3.getAccount().then(result => {
      this.web3.getFighterIdByAddress(result).then(result => {
        let roundNum = Number(result);
        this.web3.howManyFighters().then(result => {
          this.fighterCount = result;
          this.getFighterById(roundNum);
          this.getFighters();
          this.getTotalFighters();
        });
      })
    }).catch(err => {
      console.log(err);
    });
  }

  public getFighters() {
    console.log('enter getFighters');
      this.web3.getFighters().then(result => {
      // here we are getting the id of my Fighter
        this.myFighterId = result[0]['c'][0];
        this.getFighterById(result[0]['c']);
      }).catch(err => {
        console.log('error in getFighters');
        console.log(err);
      });
    }

  public getFighterById(id: number) {
  // use then as it is promise
      this.web3.getFighterById(id).then(result => {
  // store the fighter in the respectove variables to show in the ui.
        this.name = result[0].toString();
        this.dna = result[1].toString();
        this.level = result[2].toString();
        this.readyTime = result[3].toString();
        this.winCount = result[4].toString();
        this.lossCount = result[5].toString();

        this.topText = '<b>Fighter Name: </b>'+this.name+' | <b>DNA: </b>'+this.dna+' | <b>Level: </b>'+this.level+' | <b>Ready Time (sec): </b>'+this.readyTime;
        this.topText2 = '<b>Win Count: </b>'+this.winCount+' | <b>Loss Count: </b>'+this.lossCount+' | <b>Fighter count: </b>'+this.fighterCount;
      }).catch(err => {
        console.log(err);
      });
    }

  // function to get total fighter on the blockchain
  public getTotalFighters() {
  this.web3.totalFighters().then(result => {
    // console.log(result);
    for (var i = 0; i < parseInt(result, 10); i++) {
      this.getAllFighters(i);
    }
    console.log(this.uiFighterArray);
  }).catch(err => {
    console.log(err);
  });
}

  public getAllFighters(id) {
  this.web3.getFighterById(id).then(result => {
    this.allFighters.push(result);
    const fighter: { name: string, id: string } = { name: '', id: '' };
    fighter.name = result[0];
    fighter.id = id;
    console.log('fighterById!');
    if(this.myFighterId != undefined){
      if(this.myFighterId.toString() != fighter.id.toString() || this.myFighterId.toString() !== fighter.id.toString()){
        this.uiFighterArray.push(fighter);
      }
    } else {
      this.uiFighterArray.push(fighter);
    }
    }).catch(err => {
      console.log(err);
    });
  }

  public attack(enemyId: number) {
    this.web3.attack(this.myFighterId, enemyId).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public levelUp() {
    this.web3.levelUp(this.myFighterId).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public changeName(newName: string) {
    this.web3.changeName(this.myFighterId, newName).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public changeDna(newDna: number) {
    this.web3.changeDna(this.myFighterId, newDna).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public createFighter(name: string) {
    console.log(name);
    this.web3.createFighter(name).then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    });
  }

  public fighterImage(id: number) {
    return '/assets/images/'+id+'.gif';
  }
}
