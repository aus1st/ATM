let users = [];
export function generateUser() {
    for (let u = 0; u < 4; u++) {
        let randPin = Math.floor(Math.random() * 5);
        users.push({
            userName: `user-${u}`,
            pin: randPin * Math.floor(Math.random() * 321)
        });
    }
    return users;
}
