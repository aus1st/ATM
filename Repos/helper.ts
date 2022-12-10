import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';
import gradient from 'gradient-string';
import User from '../Models/user.js';
import { balanceEnqiry, checkBalance, getStatement, makeTxn, withdrawl } from '../Repos/accounting.js'


const sleep = (d = 1000) => new Promise((r) => setTimeout(r, d));

let generalMsg = "Please wait...";

let user: User = {
    userName: '',
    pin: 0
};

const spinner = createSpinner(generalMsg);



export async function welComeScreen(msg: string) {
    console.clear();
    figlet(msg, (err, data) => {
        console.log(gradient.pastel(data))
    });
    await sleep();
}



export async function validateUser() {
    spinner.start()
    await sleep();
    spinner.success({
        text: `Welcome: ${user.userName.toUpperCase()}`
    })
    //spinner.stop();
    await makeTxn(user);
    //return true;
}


export async function getUserCreds() {
    let inputUserName = await inquirer.prompt({
        name: 'uName',
        type: 'input',
        message: 'Input User Id'
    });
    user.userName = inputUserName.uName;

    let inputPin = await inquirer.prompt({
        name: 'uPin',
        type: 'password',
        message: 'Input Pin:'
    });
    user.pin = inputPin.uPin;

    return user;
}


export async function atmOptions() {
    let userSelection = await inquirer.prompt({
        name: 'facility',
        type: 'list',
        message: 'What would you like to do? ',
        choices: [
            "1. Fast Cash", "2. Cash Withdrawl", "3. Bill Payment",
            "4. Funds Transfer", "5. Mini Statement",
            "6. Balance Enquiry"
        ]
    });
    return userSelection.facility;
}

async function getCashInput() {
    let inputFastCash= await inquirer.prompt({
        name: 'fcash',
        type: 'number',
        message: 'Input Amount'
    });

    return inputFastCash.fcash;
}


export async function performTxn() {
    let selectedOpt = await atmOptions();
    return new Promise( async(res, rej) => {

        if ((selectedOpt as string).includes("1")) {
            let cashInput = await getCashInput();
            
            //check balance
            if(checkBalance(cashInput)) {
                spinner.start();
                let result =  withdrawl(cashInput,user,"Cash withdrawl");               
                await sleep();
               if(typeof result === 'string') {
                   console.log(result); 
               } else {
                spinner.success({
                    text: `Transaction Successfull`
                })   
                await balanceEnqiry();

               }
            }

            //await sleep();

        }


    });
}

