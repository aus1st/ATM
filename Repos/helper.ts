import inquirer from "inquirer";
import { createSpinner } from "nanospinner";
import figlet, { fontsSync } from "figlet";
import gradient from "gradient-string";
import User from "../Models/user.js";
import {
  balanceEnqiry,
  checkBalance,
  getBalance,
  getStatement,
  makeTxn,
  withdrawl,
} from "../Repos/accounting.js";

export let startProg = "S";

const sleep = (d = 1000) => new Promise((r) => setTimeout(r, d));

let generalMsg = "Please wait...";

let user: User = {
  userName: "",
  pin: 0,
};

const spinner = createSpinner(generalMsg);

let spinnerSuccess = (successMsg: string) =>
  new Promise((r) => r(spinner.success({ text: successMsg })));

export async function welComeScreen(msg: string) {
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
    text: `Welcome: ${user.userName.toUpperCase()}`,
  });
  //spinner.stop();
  await makeTxn(user);
  spinner.stop();
  //return true;
}

export async function getUserCreds() {
  let inputUserName = await inquirer.prompt({
    name: "uName",
    type: "input",
    message: "Input User Id",
  });
  user.userName = inputUserName.uName;

  let inputPin = await inquirer.prompt({
    name: "uPin",
    type: "password",
    message: "Input Pin:",
  });
  user.pin = inputPin.uPin;

  return user;
}

export async function atmOptions() {
  let userSelection = await inquirer.prompt({
    name: "facility",
    type: "list",
    message: "What would you like to do? ",
    choices: [
      "1. Fast Cash",
      "2. Cash Withdrawl",
      "3. Bill Payment",
      "4. Funds Transfer",
      "5. Mini Statement",
      "6. Balance Enquiry",
      "7. Exit",
    ],
  });
  return userSelection.facility;
}

async function getCashInput() {
  let inputFastCash = await inquirer.prompt({
    name: "fcash",
    type: "number",
    message: "Input Amount",
  });

  return inputFastCash.fcash;
}

type billPaymet = {
  serviceProvider: string;
  invoiceNumber: string;
  invoiceAmount: number;
};

type fundsTransfer = {
  bene: string;
  accountNumber: string;
  transferAmount: number;
};

async function getBillPaymentInput() {
  let selectProvider = await inquirer.prompt({
    name: "provider",
    type: "list",
    choices: ["1. K-E", "2. SSG", "3. KW&SB"],
    message: "Select Provider",
  });

  let invoiceNum = await inquirer.prompt({
    name: "invno",
    type: "input",
    message: "Input Invoice No. ",
  });

  await sleep();
  spinnerSuccess("getting info...");
  let inputBillPayment = await inquirer.prompt({
    name: "bPayment",
    type: "number",
    message: "Input Amount",
  });

  let billPaymet: billPaymet = {
    invoiceNumber: invoiceNum.invno,
    serviceProvider: selectProvider,
    invoiceAmount: inputBillPayment.bPayment,
  };
  return billPaymet;

  //payment.invoiceAmount = inputBillPayment.bPayment;
}

async function getFtInput() {
  let selectBank = await inquirer.prompt({
    name: "bank",
    type: "list",
    choices: ["HBL", "ABL", "UBL", "JSBL"],
    message: "Select Beneficiary Bank",
  });

  let accountNo = await inquirer.prompt({
    name: "acno",
    type: "input",
    message: "Input Account No. ",
  });

  await sleep();
  //spinnerSuccess('getting info...');
  let transfAmount = await inquirer.prompt({
    name: "tAmount",
    type: "number",
    message: "Input Amount",
  });

  let ftTxn: fundsTransfer = {
    accountNumber: accountNo.acno,
    bene: selectBank,
    transferAmount: transfAmount.tAmount,
  };
  return ftTxn;

  //payment.invoiceAmount = inputBillPayment.bPayment;
}

export async function performTxn(selectedOpt: string) {

  if ((selectedOpt as string).includes("1")) {
    let cashInput = await getCashInput();

    //check balance
    if (await checkBalance(cashInput)) {
      spinner.start();
      let result = await withdrawl(cashInput, user, "Fast Cash withdrawl");
      await sleep();
      if (typeof result === "string") {
        // console.log(result);
      } else {
        // console.log('Transaction Successfull');
        await spinnerSuccess("Transaction Successfull");
        await balanceEnqiry();
      }
    } else {
      console.log("Insufficient Balance");
    }
  } else if ((selectedOpt as string).includes("2")) {
    let cashInput = await getCashInput();

    //check balance
    if (await checkBalance(cashInput)) {
      //spinner.start();
      let result = await withdrawl(cashInput, user, "Cash withdrawl");
      await sleep();
      if (typeof result === "string") {
        console.log(result);
      } else {
        //console.log('Transaction Successfull');
        spinnerSuccess("Transaction Successfull");
        //spinner.stop();
        await balanceEnqiry();
      }
    } else {
      console.log("Insufficient Balance");
    }

    //await sleep();
  } else if ((selectedOpt as string).includes("3")) {
    let billPaymet = await getBillPaymentInput();

    //check balance
    if (await checkBalance(billPaymet.invoiceAmount)) {
       spinner.start();
      let result = await withdrawl(
        billPaymet.invoiceAmount,
        user,
        "Bill Pay of :" + billPaymet.invoiceNumber
      );
      await sleep();
      if (typeof result === "string") {
        console.log(result);
      } else {
        spinnerSuccess("Transaction Successfull");
        await balanceEnqiry();
      
      }
    } else {
      console.log("Insufficient Balance");
    }
  } else if ((selectedOpt as string).includes("4")) {
    let ftTxn = await getFtInput();

    //check balance
    if (await checkBalance(ftTxn.transferAmount)) {
      spinner.start();
      let result = await withdrawl(
        ftTxn.transferAmount,
        user,
        "FT " + ftTxn.bene + " " + ftTxn.accountNumber
      );
      await sleep();
      if (typeof result === "string") {
        console.log(result);
      } else {
        
        spinnerSuccess("Transaction Successfull");
        await balanceEnqiry();
        
      }
    } else {
      console.log("Insufficient Balance");
    }
  } else if ((selectedOpt as string).includes("5")) {
    await sleep();
    await getStatement();
    
  } else if ((selectedOpt as string).includes("6")) {
    
    await balanceEnqiry();
  } else if ((selectedOpt as string).includes("7")) {
    
    startProg = "E";
  }
 
}

export async function userSelection() {
  let select = await inquirer.prompt({
    name: "uInput",
    type: "confirm",
    message: "Would you like to make Transaction",
  });
  return select.uInput;
  //return startProg;
}

let keepContinue = false;
export async function startProgram() {
  await welComeScreen("A T M");
  await getUserCreds();
  await validateUser();
  await getBalance();

  while (!keepContinue) {
    let s = await userSelection();
    if (s) {
      let x = await atmOptions();
      await performTxn(x);
    } else {
      keepContinue = true;
    }
  }
}
