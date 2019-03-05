import { Injectable } from '@angular/core';
const Web3 = require('web3');

declare let window: any;
declare let require: any;

const contractAbi = require('./contract.abi.json');
const contractAddress = '0x65bdd59dd412f07511caadc1eff555043d807c45';

@Injectable({
  providedIn: 'root'
})
export class Web3Service {

  private _account: string = null;
  private _web3: any;
  private _contract: any;
  private _contractAddress: string;

  constructor() {
    this.initializeWeb3();
  }

  initializeWeb3(){
    if (typeof window.web3 !== 'undefined') {
      this._web3 = new Web3(window.web3.currentProvider);
      console.log('metamask is found');
    } else{
    }
    this._contract = this._web3.eth.contract(contractAbi).at(contractAddress);
  }

  // this function returns a promise
  public async getAccount(): Promise<any> {
      // we will check if we already have the _account.
      if (this._account == null) {
         // then we will create a new Promise
        this._account = await new Promise((resolve, reject) => {
          // with the help of web3 we will talk to metamask and get the account.
          // this._web3.eth.getAccounts will return the accounts from metamask
          // We have to pass a callback function to get the response from the metamask
          this._web3.eth.getAccounts((err, accs) => {
            if (err != null) {
              console.log('There was an error fetching your accounts.');
              return;
            }
            if (accs.length === 0) {
              alert(
                'Couldn\'t get any accounts! Make sure your Ethereum client or Metamask is configured correctly.'
              );
              return;
            }
            return resolve(accs[0]);
          });
        }) as string;
        this._web3.eth.defaultAccount = this._account;
      }
      console.log(Promise.resolve(this._account));
      return Promise.resolve(this._account);
    }

    // function will return promise
     public async owner(): Promise<any> {
        const account = await this.getAccount();
        return new Promise((resolve, reject) => {
            // we have to pass the callback function to get the response from the blockchain
          this._contract.owner.call((err, result) => {
            if (err != null) {
              return reject(err);
            }
            return resolve(result);
          });
        }) as any;
      }

  // create a function called getFighters it will return a promise
  public async getFighters(): Promise<number[]> {
      // const account = await this.owner();
      const account = await this.getAccount();
      //It will return a new Promise
      return new Promise((resolve, reject) => {
      // from our contract instance call getFighterByOwner from the contract
      // pass a callback in the function the contract function
        this._contract.getFightersByOwner.call(account, (err, result) => {
          if (err != null) {
            return reject(err);
          }
      // we will get the response in BigNumber javascript cant deal with big numbers so lets return a comfortable digit
          // return resolve(result[0].c);
          return resolve(result);
        });
      }) as any;
  }

  // this function will return a promise
  public async getFighterById(id: number): Promise<any> {
      return new Promise((resolve, reject) => {
      // call fighters function from the contract and to get the response pass a callback function to it.
        this._contract.fighters.call(id, (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        });
      }) as any;
    }

    public async getFighterIdByAddress(address: number): Promise<unknown> {
        return new Promise((resolve, reject) => {
        // call fighters function from the contract and to get the response pass a callback function to it.
          this._contract.getFightersByOwner.call(address, (err, result) => {
            if (err != null) {
              return reject(err);
            }
            return resolve(result);
          });
        }) as unknown;
      }

    // function will return a promise
    public async totalFighters(): Promise<any> {
    // pass a callback function
        return new Promise((resolve, reject) => {
    // from the contract instance call totalFighters function
          this._contract.totalFighters.call((err, result) => {
            if (err != null) {
              return reject(err);
            }
            return resolve(result.toString());
          });
        }) as any;
      }

  // This is an async function so we have to create the Promise for it
  public async attack(myId, enemyId): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
    // This function is a transactional function we need an account from which it is been carrying out
    this._contract.attack(myId, enemyId, { from: account },
    // pass a callback function to get the value from the blockchain
      (err, result) => {
        if (err != null) {
          console.log('we have error in attack');
          return reject(err);
        }
    // return the promise
        return resolve(result);
      }
    );
    }) as any;
  }

  // async function so we have to use the promise
public async levelUp(id: number): Promise<any> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {

    // transactional function so we have to send account information
    // also its a payable function so send the ether value in value key
      this._contract.levelUp(id, { from: account, value: this._web3.toWei(0.01, 'ether') },
        ((err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        }),
      );
    }) as any;
  }

  public async changeName(id: number, newName: string): Promise<any> {
   const account = await this.getAccount();
   return new Promise((resolve, reject) => {
// since this is a transactional function we have to tell blockchain where it is coming from
//  account is the first account from the account list that's why account[0]
// calling the changeName function on the contract
     this._contract.changeName(id, newName, { from: account },
       (err, result) => {
         if (err != null) {
           return reject(err);
         }
         return resolve(result);
       },
     );
   }) as any;
 }

 public async changeDna(id: number, newDna: number): Promise<any> {
  const account = await this.getAccount();
  return new Promise((resolve, reject) => {
// since this is a transactional function we have to tell blockchain where it is coming from
//  account is the first account from the account list that's why account[0]
// calling the changeName function on the contract
    this._contract.changeDna(id, newDna, { from: account },
      (err, result) => {
        if (err != null) {
          return reject(err);
        }
        return resolve(result);
      },
    );
  }) as any;
}

// async function will return a promise
  public async createFighter(name: string): Promise<any> {

// transactional function so it will need an address in the msg object
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
// calling generateRandomFighter from smart contract from the blockchain
      this._contract.generateRandomFighter(name, { from: account },

// pass a call back to get the transactionId from the blockchain
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    }) as any;
  }

  // function will return a promise
  public async howManyFighters(): Promise<number> {
    const account = await this.getAccount();
  // pass a callback function
      return new Promise((resolve, reject) => {
        this._contract.getOwnerFighterCount({ from: account },
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result.toString());
        });
      }) as number;
    }
}
