import {getUserCreds, validateUser,welComeScreen, atmOptions, performTxn,userSelection,startProg, startProgram} from "./helper.js";
import {getBalance} from '../Repos/accounting.js';

await welComeScreen('A T M . CLI');
await getUserCreds();
await validateUser();
await getBalance();
//await getStatement();
//await balanceEnqiry();
//await atmOptions();
await startProgram();
//await getStatement();
