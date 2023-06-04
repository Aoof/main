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
            let second_text = `${seconds}s `

            if ((days != 0 || hours != 0 || minutes != 0) && seconds == 0) { secondText = " and " + secondText}

            if (days == 0)      { dayText = "" }
            if (hours == 0)     { hourText = "" }
            if (minutes == 0)   { minuteText = "" }
            if (seconds == 0)   { second_text = "a few seconds" }

            el.innerHTML = dayText + hourText + minuteText + second_text;
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
}
