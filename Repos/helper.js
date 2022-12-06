import figlet from 'figlet';
import gradient from 'gradient-string';
import { generateUser } from './userGeneration.js';
const sleep = (d = 1000) => new Promise((r) => setTimeout(r, d));
async function welComeScreen(msg) {
    console.clear();
    figlet(msg, (err, data) => {
        console.log(gradient.pastel(data));
    });
    await sleep();
}
let userNames = [];
let pins = [];
let users = generateUser();
console.log(users);
function getUserCreds() {
}
function getUserSelection() {
}
export default users;
