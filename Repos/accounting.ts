import StatementEntry from '../Models/statementEntry.js'
import User from '../Models/user.js';

let accountBalance = 5000;

let stmt:StatementEntry []=[];

//const sleep = (d=1000)=> new Promise((r) => setTimeout(r,d));


//let myAdd: (a: number, b: number)=> number = (a,b)=> a+b;


export function makeTxn(usr: User, amount = accountBalance, narr = "") {
    return new Promise((r) => {
        try {
            stmt.push({
                userName: usr.userName,
                txnAmount: amount,
                narration: 'Opening Bal',
                txnDate: new Date()
            });
            //console.log(stmt);
        } catch (error) {
            console.log('Getting some difficulty in making Txn');
        }
        setTimeout(r, 1000);

    });
}


export function checkBalance(Withdrawl: number) {
    if(Withdrawl > accountBalance) {
        return false
    } else {
        return true;
    }
}

export function withdrawl(amount: number, user: User, narr=""): number|string {
    if(checkBalance(amount)) {
        makeTxn(user,amount,narr);
        accountBalance-= amount;
        return accountBalance;
    } else {
            return 'Insufficient Balance';
    }
}

export async function balanceEnqiry() {
    return  new Promise((res)=> res(console.log(`$ you have ${accountBalance} remaining in your account \n`)));
}

export function getStatement() {
    return new Promise((res) => {
        console.log('# Date \t\t Narration\t Amount');
            let counter = 1;
            stmt.forEach(t => {
                console.log(`${counter}. ${t.txnDate.getDate()+'-'+t.txnDate.getMonth()+'-'+t.txnDate.getFullYear()}\t
                 ${t.narration}\t${t.txnAmount}\n`);
                counter++;
            });
        setTimeout(res,1000);       
    });

}

export function fundsTransfer(usr: User, amount:number, narr:string) {
    if(checkBalance(amount)) {
        makeTxn(usr,amount,narr);
        return 'Txn Successfull';
    } else {
        return  `you have ${accountBalance} remaining in your account`;
    }
}

