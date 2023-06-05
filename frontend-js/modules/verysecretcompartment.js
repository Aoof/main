const moment = require("moment");

export default class VerySecretCompartment {
    constructor() {
        this.lastCursedElems = document.querySelectorAll(".last-cursed");
        this.streaks = document.querySelectorAll(".longest-streak");

        this.logLastCursedElems = document.querySelectorAll(".log_last-cursed");
        this.logLongestStreaks = document.querySelectorAll(".log_longest-streak");

        this.checkLogsBtn = document.querySelector("#check-logs");
        this.toggleableBodies = document.querySelectorAll(".toggleable-body");

        this.counter = 0;
        this.events()
    }

    events() {
        this.streaks.forEach(el => {
            let current = moment(el.parentElement.querySelector(".last-cursed").dataset.lastCursed); // Already offset to local time
            el.innerHTML = this.getTimestamp(el, current);
        })

        this.logLongestStreaks.forEach(el => {
            el.innerHTML = this.getTimestamp(el, parseFloat(el.dataset.total), true);
        })

        this.updateLastCursed()
        this.updateLogLastCursed()

        this.setupCheckLogs()

        setInterval(() => {
            this.updateLastCursed()
            this.counter += 1
        }, 1000)
    }

    getTimestamp(el, current, isLog = false) {
        let diff;
        if (isLog) { diff = current; }
        else { diff = moment().diff(current, "hours", true) }

        let _days = parseInt(el.dataset.days)
        let _hours = parseInt(el.dataset.hours)
        let _minutes = parseInt(el.dataset.minutes)
        let _seconds = parseInt(el.dataset.seconds)

        let _diff = _days * 24 + _hours + _minutes / 60 + _seconds / 3600

        let days = 0, hours = 0, minutes = 0, seconds = 0;

        if (diff > _diff) {
            days = Math.floor(diff / 24);
            hours = Math.floor(diff - days * 24);
            minutes = Math.floor((diff - hours - days * 24) * 60);
            seconds = Math.floor((((diff - hours - days * 24) * 60) - minutes) * 60);
        } else {
            days = _days;
            hours = _hours;
            minutes = _minutes;
            seconds = _seconds;
        }

        el.dataset.days = days
        el.dataset.hours = hours
        el.dataset.minutes = minutes
        el.dataset.seconds = seconds

        let dayText    = `${days}d `
        let hourText   = `${hours}h `
        let minuteText = `${minutes}m `
        let secondText = `${seconds}s `

        if ((days != 0 || hours != 0 || minutes != 0) && seconds == 0) { secondText = " and " + secondText}

        if (days == 0)      { dayText = "" }
        if (hours == 0)     { hourText = "" }
        if (minutes == 0)   { minuteText = "" }
        if (seconds == 0)   { secondText = "a few seconds" }
        return dayText + hourText + minuteText + secondText;
    }

    updateLogLastCursed() {
        this.logLastCursedElems.forEach(el => {
            let time = moment(el.dataset.lastCursed);
            let diff = moment().diff(time, "hours", true);

            diff += this.counter / 3600;
            diff = Math.floor(diff * 100) / 100;

            el.innerHTML = time.format() + ` (${diff} hours ago)`;
        })
    }

    updateLastCursed() {
        this.lastCursedElems.forEach(el => {
            let time = moment(el.dataset.lastCursed);
            let diff = moment().diff(time, "hours", true);

            let days = Math.floor(diff / 24);
            let hours = Math.floor(diff - days * 24);
            let minutes = Math.floor((diff - hours - days * 24) * 60);

            diff = diff + this.counter / 3600;
            
            let dayText    = `${days}d `
            let hourText   = `${hours}h `
            let minuteText = `${minutes}m `

            if (days == 0)      { dayText = "" }
            if (hours == 0)     { hourText = "" }
            if (minutes == 0)   { minuteText = "a few seconds " }

            if ((days != 0 || hours != 0) && minutes == 0) { minuteText = " and " + minuteText}

            let timeText = time.format("DD/MM/YY hh:mm:ss A")

            if (time.get("year") == moment().get("year")) timeText = time.format("(DD/MM) hh:mm:ss A")
            if (time.get("day") == moment().get("day")) timeText = time.format("hh:mm:ss A")
            if (time.get("day") == moment().subtract(1, "days").get("day")) timeText = "Yesterday at " + time.format("hh:mm:ss A")

            el.innerHTML = timeText + ` (${dayText}${hourText}${minuteText}ago)`;
        })
    }

    setupCheckLogs() {
        this.checkLogsBtn.addEventListener("click", () => {
            let selector = this.checkLogsBtn.dataset.selector;
            if (this.checkLogsBtn.classList.contains("activated")) {
                this.checkLogsBtn.classList.remove("activated");
                this.checkLogsBtn.innerHTML = this.checkLogsBtn.dataset.value;
                this.toggleableBodies.forEach(el => {
                    if (el.dataset.selectee == this.checkLogsBtn.dataset.prevSelectee)
                    {
                        el.classList.add("show");
                    } else {
                        el.classList.remove("show");
                    }
                })
                return;
            }

            this.toggleableBodies.forEach(el => {
                if (el.dataset.selectee == selector) {
                    el.classList.add("show");
                } else if (el.classList.contains("show")) {
                    el.classList.remove("show");
                    this.checkLogsBtn.dataset.prevSelectee = el.dataset.selectee;
                }
            })

            this.checkLogsBtn.classList.toggle("activated");
            this.checkLogsBtn.innerHTML = "Close"
        })
    }
}
