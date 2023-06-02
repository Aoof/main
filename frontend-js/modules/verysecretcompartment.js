const moment = require("moment");

export default class VerySecretCompartment {
    constructor() {
        this.lastCursedElems = document.querySelectorAll(".last-cursed");
        this.streaks = document.querySelectorAll(".longest-streak");

        this.counter = 0;
        this.events()
    }

    events() {
        this.streaks.forEach(el => {
            let current = moment(el.parentElement.querySelector(".last-cursed").dataset.lastCursed); // Already offset to local time
            let diff = moment().diff(current, "hours", true)

            let _hours = parseInt(el.dataset.hours)
            let _minutes = parseInt(el.dataset.minutes)
            let _seconds = parseInt(el.dataset.seconds)

            let _diff = _hours + _minutes / 60 + _seconds / 3600

            let hours = 0, minutes = 0, seconds = 0;

            if (diff > _diff) {
                hours = Math.floor(diff);
                minutes = Math.floor((diff - hours) * 60);
                seconds = Math.floor((((diff - hours) * 60) - minutes) * 60);
            } else {
                hours = _hours;
                minutes = _minutes;
                seconds = _seconds;
            }

            el.dataset.hours = hours
            el.dataset.minutes = minutes
            el.dataset.seconds = seconds

            el.innerHTML = `${hours} hours, ${minutes} minutes, and ${seconds} seconds`
        })

        this.updateLastCursed()

        setInterval(() => {
            this.updateLastCursed()
            this.counter += 1
        }, 1000)
    }

    updateLastCursed() {
        this.lastCursedElems.forEach(el => {
            let time = moment(el.dataset.lastCursed);
            let diff = moment().diff(time, "hours", true);

            let hours = Math.floor(diff);
            let minutes = Math.floor((diff - hours) * 60);

            diff = diff + this.counter / 3600;
            
            el.innerHTML = time.format("DD/MM/YY hh:mm:ss A") + ` (${hours} hours and ${minutes} minutes ago)`;
        })
    }
}
