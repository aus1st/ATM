import StatementEntry from '../Models/statementEntry.js'
import User from '../Models/user.js';

let accountBalance = Math.floor(Math.random()*5000);

let stmt:StatementEntry []=[];

function insertIntoStmt(usr: User, amount = accountBalance, narr = "") {
    try {
        stmt.push({
            userName: usr.userName,
            txnAmount: amount,
            narration: stmt.length == 0 ? 'Opening Bal' : narr,
            txnDate: new Date()
        });
        //console.log(stmt);
    } catch (error) {
        console.log('Getting some difficulty in making Txn');
    }

}


export function makeTxn(usr: User, amount = accountBalance, narr = "") {
    //console.log('making txn called');
    return new Promise((r,rej) => {
        r(insertIntoStmt(usr,amount,narr));       
        //setTimeout(r, 1000);

    });
}

export const getBalance =  ()=> new Promise((res)=> res(console.log(`You have: ${accountBalance} in your ACcount`)));

export function checkBalance(Withdrawl: number) {
    return new Promise((res)=>{
        if(Withdrawl < accountBalance) {
            res(true)
        } else {
            res(false);
        }
    })
    
}

export async function withdrawl(amount: number, user: User, narr="") {
    //console.log('inside withdrawl');
    if(await checkBalance(amount)) {
        await makeTxn(user,amount,narr);
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
    let stream = "";
    
    stream+='# Date \t\t Narration\t\t Amount\n';
    let counter = 1;
    stmt.forEach(t => {
        stream+=`${counter}. ${t.txnDate.getDate()+'-'+t.txnDate.getMonth()+'-'+t.txnDate.getFullYear()}\t${t.narration}\t\t${t.txnAmount}\n`;
        counter++;
    });

    return new Promise((res) => res(console.log(stream)));
}

export async function fundsTransfer(usr: User, amount:number, narr:string) {
    if(await checkBalance(amount)) {
        await makeTxn(usr,amount,narr);
        return 'Txn Successfull';
    } else {
        return  `you have ${accountBalance} remaining in your account`;
    }
}

