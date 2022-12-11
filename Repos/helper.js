import inquirer from 'inquirer';
import { createSpinner } from 'nanospinner';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { balanceEnqiry, checkBalance, getStatement, makeTxn, withdrawl } from '../Repos/accounting.js';
export let startProg = 'S';
const sleep = (d = 1000) => new Promise((r) => setTimeout(r, d));
let generalMsg = "Please wait...";
let user = {
    userName: '',
    pin: 0
};
const spinner = createSpinner(generalMsg);
let spinnerSuccess = (successMsg) => spinner.success({ text: successMsg });
export async function welComeScreen(msg) {
    console.clear();
    figlet(msg, (err, data) => {
        console.log(gradient.pastel(data));
    });
    await sleep();
}
export async function validateUser() {
    spinner.start();
    await sleep();
    spinner.success({
        text: `Welcome: ${user.userName.toUpperCase()}`
    });
    //spinner.stop();
    await makeTxn(user);
    spinner.stop();
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
            "6. Balance Enquiry", "7. Exit"
        ]
    });
    return userSelection.facility;
}
async function getCashInput() {
    let inputFastCash = await inquirer.prompt({
        name: 'fcash',
        type: 'number',
        message: 'Input Amount'
    });
    return inputFastCash.fcash;
}
async function getBillPaymentInput() {
    let selectProvider = await inquirer.prompt({
        name: 'provider',
        type: 'list',
        choices: [
            '1. K-E', '2. SSG', '3. KW&SB'
        ],
        message: 'Select Provider'
    });
    let invoiceNum = await inquirer.prompt({
        name: 'invno',
        type: 'input',
        message: 'Input Invoice No. '
    });
    await sleep();
    spinnerSuccess('getting info...');
    let inputBillPayment = await inquirer.prompt({
        name: 'bPayment',
        type: 'number',
        message: 'Input Amount'
    });
    let billPaymet = {
        invoiceNumber: invoiceNum.invno,
        serviceProvider: selectProvider,
        invoiceAmount: inputBillPayment.bPayment
    };
    return billPaymet;
    //payment.invoiceAmount = inputBillPayment.bPayment;
}
async function getFtInput() {
    let selectBank = await inquirer.prompt({
        name: 'bank',
        type: 'list',
        choices: [
            'HBL', 'ABL', 'UBL', 'JSBL'
        ],
        message: 'Select Beneficiary Bank'
    });
    let accountNo = await inquirer.prompt({
        name: 'acno',
        type: 'input',
        message: 'Input Account No. '
    });
    await sleep();
    //spinnerSuccess('getting info...');
    let transfAmount = await inquirer.prompt({
        name: 'tAmount',
        type: 'number',
        message: 'Input Amount'
    });
    let ftTxn = {
        accountNumber: accountNo.acno,
        bene: selectBank,
        transferAmount: transfAmount.tAmount
    };
    return ftTxn;
    //payment.invoiceAmount = inputBillPayment.bPayment;
}
export async function performTxn(selectedOpt) {
    //let selectedOpt = await atmOptions();
    return new Promise(async (res, rej) => {
        if (selectedOpt.includes("1")) {
            let cashInput = await getCashInput();
            //check balance
            if (await checkBalance(cashInput)) {
                //spinner.start();
                let result = await withdrawl(cashInput, user, "Fast Cash withdrawl");
                await sleep();
                if (typeof result === 'string') {
                    console.log(result);
                }
                else {
                    console.log('Transaction Successfull');
                    await balanceEnqiry();
                    //spinner.stop();
                }
            }
        }
        else if (selectedOpt.includes("2")) {
            let cashInput = await getCashInput();
            //check balance
            if (await checkBalance(cashInput)) {
                //spinner.start();
                let result = await withdrawl(cashInput, user, "Cash withdrawl");
                await sleep();
                if (typeof result === 'string') {
                    console.log(result);
                }
                else {
                    console.log('Transaction Successfull');
                    //spinner.stop();
                    await balanceEnqiry();
                }
            }
            //await sleep();
        }
        else if (selectedOpt.includes("3")) {
            let billPaymet = await getBillPaymentInput();
            //check balance
            if (await checkBalance(billPaymet.invoiceAmount)) {
                // spinner.start();
                let result = await withdrawl(billPaymet.invoiceAmount, user, billPaymet.serviceProvider + '\n' + billPaymet.invoiceNumber);
                await sleep();
                if (typeof result === 'string') {
                    console.log(result);
                }
                else {
                    console.log('Transaction Successfull');
                    await balanceEnqiry();
                    //spinner.stop();
                }
            }
        }
        else if (selectedOpt.includes("4")) {
            let ftTxn = await getFtInput();
            //check balance
            if (await checkBalance(ftTxn.transferAmount)) {
                // spinner.start();
                let result = await withdrawl(ftTxn.transferAmount, user, 'FT ' + ftTxn.bene + '\n' + ftTxn.accountNumber);
                await sleep();
                if (typeof result === 'string') {
                    console.log(result);
                }
                else {
                    console.log('Transaction Successfull');
                    await balanceEnqiry();
                    // spinner.stop();
                }
            }
        }
        else if (selectedOpt.includes("5")) {
            await sleep();
            await getStatement();
        }
        else if (selectedOpt.includes("6")) {
            //await sleep();
            await balanceEnqiry();
        }
        else if (selectedOpt.includes("7")) {
            //await sleep();
            startProg = 'E';
        }
    });
}
export async function userSelection() {
    let select = await inquirer.prompt({
        name: 'uInput',
        type: 'input',
        message: 'Please Press S to Start Programe E to exit'
    });
    startProg = select.uInput;
    return startProg;
}
export async function startProgram() {
    let s = await userSelection();
    //startProg = s;
    while (startProg != "E") {
        let x = await atmOptions();
        await performTxn(x);
    }
}
