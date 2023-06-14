const moment = require("moment");
const randosCollection = require("../db").collection("randos");
const logsCollection = require("../db").collection("logs");

let Rando = function(body, isLog = false) {

    this.name = body.name;
    if (isLog) {
        this.legacy_last_cursed = body.legacyLastCursed;
        this.legacy_longest_streak = parseFloat(body.legacyLongestStreak);
        this.legacy_cuss_counter = parseInt(body.legacyCussCounter);
    }
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

Rando.prototype.randoJustCussed = function() {
    return new Promise(async (resolve, reject) => {
        this.last_cursed = moment().utc().format();
        let rando = await randosCollection.findOne({ name: this.name })
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
        });
}

Rando.prototype.revertToLegacy = function() {
    return new Promise(async (resolve, reject) => {
        let rando = await randosCollection.findOne({ name: this.name })
        if (rando) {
            randosCollection.updateOne({ name: this.name }, { $set: { last_cursed: this.legacy_last_cursed, longest_streak: this.legacy_longest_streak, cuss_counter: parseInt(this.legacy_cuss_counter) } })
            .then(() => {
                resolve();
            })
            .catch(() => {
                this.errors.push("Please try again later.");
                reject(this.errors);
            });
        }
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
    });
}

Rando.prototype.logTheCuss = function() {
    return new Promise(async (resolve, reject) => {
        logsCollection.insertOne({
            name: this.name,
            cussed_at: moment().utc().format(),
            prev_cussed_at: moment(this.legacy_last_cursed).utc().format(),
            old_longest_streak: parseFloat(this.legacy_longest_streak),
            old_cuss_counter: parseInt(this.legacy_cuss_counter)
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

Rando.prototype.getLogs = function() {
    return new Promise(async (resolve, reject) => {
        logsCollection.find().toArray()
        .then(logs => {
            logs = logs.map(log => {
                if (JSON.stringify(log.old_longest_streak).includes('"')) { log.old_longest_streak = JSON.parse(log.old_longest_streak) }

                log.cussed_at_utc = moment(log.cussed_at).format();
                log.cussed_at = moment(log.cussed_at).format("DD-MM-YYYY hh:mm:ss A");
                log.prev_cussed_at_utc = moment(log.prev_cussed_at).format();
                log.prev_cussed_at = moment(log.prev_cussed_at).format("DD-MM-YYYY hh:mm:ss A");

                days = Math.floor(log.old_longest_streak / 24).toString();
                hours = Math.floor(log.old_longest_streak - days * 24).toString();
                minutes = Math.floor((log.old_longest_streak - hours - days * 24) * 60).toString();
                seconds = Math.floor((((log.old_longest_streak - hours - days * 24) * 60) - minutes) * 60).toString();

                log.old_longest_streak = { days: days, hours: hours, minutes: minutes, seconds: seconds, total: JSON.stringify(log.old_longest_streak) }
                return log;
            });
            logs.reverse();
            resolve(logs);
        })
        .catch(e => {
            console.log(e)
            this.errors.push("Please try again later.");
            reject(this.errors);
        });
    })
}

Rando.prototype.getAllRandos = function() {
    return new Promise(async (resolve, reject) => {
        randosCollection.find().toArray()
        .then(randos => {
            randos.sort((a, b) => {
                return -moment(b.last_cursed).diff(moment(a.last_cursed));
            });
            randos = randos.map(rando => {
                rando.last_cursed_utc = moment(rando.last_cursed).utc().format();
                rando.last_cursed = moment(rando.last_cursed).format("DD-MM-YYYY hh:mm:ss A");

                days = Math.floor(rando.longest_streak / 24).toString();
                hours = Math.floor(rando.longest_streak - days * 24).toString();
                minutes = Math.floor((rando.longest_streak - hours - days * 24) * 60).toString();
                seconds = Math.floor((((rando.longest_streak - hours - days * 24) * 60) - minutes) * 60).toString();

                rando.longest_streak = { days: days, hours: hours, minutes: minutes, seconds: seconds, total: rando.longest_streak }
                return rando;
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