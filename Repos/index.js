import { getUserCreds, validateUser, welComeScreen, performTxn } from "./helper.js";
import { getStatement } from '../Repos/accounting.js';
await welComeScreen('A T M . CLI');
await getUserCreds();
await validateUser();
await getStatement();
//await balanceEnqiry();
//await atmOptions();
await performTxn();
//await getStatement();
