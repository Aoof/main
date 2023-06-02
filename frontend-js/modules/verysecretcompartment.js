const moment = require("moment");
const jstz = require("jstz");

export default class VerySecretCompartment {
    constructor() {
        this.switchTimezones = document.querySelectorAll(".switch-timezones");
        this.streaks = document.querySelectorAll(".longest-streak");
        this.timeElem = document.querySelector("#current-time");

        this.counter = 0;
        this.events()
    }

    events() {
        let time = null

        time = moment().local()
        this.timeElem.innerHTML = time.format("DD-MM-YYYY hh:mm:ss A")

        this.streaks.forEach(el => {
            let current = moment(el.dataset.lastCursed, "DD-MM-YYYY hh:mm:ss A")
            let diff = moment().diff(current, "hours", true)

            let hours = Math.floor(diff);
            let minutes = Math.floor((diff - hours) * 60);
            let seconds = Math.floor((((diff - hours) * 60) - minutes) * 60);

            el.dataset.hours = hours
            el.dataset.minutes = minutes
            el.dataset.seconds = seconds

            el.innerHTML = `${hours} hours, ${minutes} minutes, and ${seconds} seconds`
        })

        this.switchTimezones.forEach(el => {
            let time = moment(el.dataset.lastCursed);
            let offset = new Date().getTimezoneOffset() / 60;
            time.utcOffset(offset, true);
            el.innerHTML = time.format("DD-MM-YYYY hh:mm:ss A");
        })

        setInterval(() => {
            time = moment().local()
            this.timeElem.innerHTML = time.format("DD-MM-YYYY hh:mm:ss A")

            // Do the longest streak thing
            this.streaks.forEach(el => {
                let _hours = parseFloat(el.dataset.hours)
                let _minutes = parseFloat(el.dataset.minutes) / 60
                let _seconds = (parseFloat(el.dataset.seconds) + this.counter) / 60 / 60

                let diff = _hours + _minutes + _seconds

                let hours = Math.floor(diff);
                let minutes = Math.floor((diff - hours) * 60);
                let seconds = Math.floor((((diff - hours) * 60) - minutes) * 60);

                el.innerHTML = `${hours} hours, ${minutes} minutes, and ${seconds} seconds`
            })
            this.counter += 1
        }, 1000)
    }
}
