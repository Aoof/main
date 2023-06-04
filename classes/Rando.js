const moment = require("moment");
const randosCollection = require("../db").collection("randos");

let Rando = function({ name }) {
    this.name = name;
    this.last_cursed = moment().utc().format();
    this.longest_streak = 0;
    this.cuss_counter = 0;
    this.errors = [];
}

Rando.prototype.addRando = function() {
    return new Promise(async (resolve, reject) => {
        randosCollection.insertOne({
            name: this.name,
            last_cursed: this.last_cursed,
            longest_streak: this.longest_streak,
            cuss_counter: this.cuss_counter
        })
        .then(() => {
            resolve();
        })
        .catch(() => {
            this.errors.push("Please try again later.");
            reject(this.errors);
        });
    });
}

Rando.prototype.randoJustCursed = function() {
    return new Promise(async (resolve, reject) => {
        this.last_cursed = moment().utc().format();
        randosCollection.findOne({ name: this.name })
        .then(rando => {
            if (rando) { 
                // Check the time between the last cuss and now
                if (moment().diff(moment(rando.last_cursed), "hours") >= rando.longest_streak) {
                    randosCollection.updateOne({ name: this.name }, { $set: { last_cursed: this.last_cursed, longest_streak: moment().diff(moment(rando.last_cursed), "hours", true), cuss_counter: rando.cuss_counter + 1 } })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        this.errors.push("Please try again later.");
                        reject(this.errors);
                    });
                }
                // if duration between last curse and now is smaller than the longest streak, just update last curse
                else {
                    randosCollection.updateOne({ name: this.name }, { $set: { last_cursed: this.last_cursed, cuss_counter: rando.cuss_counter + 1  } })
                    .then(() => {
                        resolve();
                    })
                    .catch(() => {
                        this.errors.push("Please try again later.");
                        reject(this.errors);
                    });
                }
            }
            // if rando doesn't exist, create rando
            else {
                this.addRando()
                .then(() => {
                    resolve();
                })
                .catch(() => {
                    this.errors.push("Please try again later.");
                    reject(this.errors);
                });
            }
        })
        .catch(() => {
            this.errors.push("Please try again later.");
            reject(this.errors);
        }
    )});
}

Rando.prototype.getAllRandos = function() {
    return new Promise(async (resolve, reject) => {
        randosCollection.find().toArray()
        .then(randos => {
            randos = randos.map(rando => {
                rando.last_cursed_utc = moment(rando.last_cursed).utc().format();
                rando.last_cursed = moment(rando.last_cursed).format("DD-MM-YYYY hh:mm:ss A");
                rando.longest_streak = {
                    days: Math.floor(rando.longest_streak / 24).toString(),
                    hours: Math.floor(rando.longest_streak - Math.floor(rando.longest_streak)).toString(),
                    minutes: Math.floor((rando.longest_streak - Math.floor(rando.longest_streak)) * 60).toString(),
                    seconds: Math.floor((((rando.longest_streak - Math.floor(rando.longest_streak)) * 60) - Math.floor((rando.longest_streak - Math.floor(rando.longest_streak)) * 60)) * 60).toString()
                }
                return rando;
            });
            randos.sort((a, b) => {
                return -moment(b.last_cursed).diff(moment(a.last_cursed));
            });
            resolve(randos);
        })
        .catch(() => {
            this.errors.push("Please try again later.");
            reject(this.errors);
        });
    });
}

module.exports = Rando;