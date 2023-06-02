const moment = require("moment");
const jstz = require("jstz");

export default class VerySecretCompartment {
    constructor() {
        this.switchTimezones = document.querySelectorAll(".switch-timezones");
        this.timeElem = document.querySelector("#current-time");
        this.events()
    }

    events() {
        this.switchTimezones.forEach(el => {
            let time = moment(el.innerHTML, "DD-MM-YYYY hh:mm:ss A")
            el.innerHTML = time.local().format("DD-MM-YYYY hh:mm:ss A")
        })

        let time = moment().local()
        this.timeElem.innerHTML = time.format("DD-MM-YYYY hh:mm:ss A")

        setInterval(() => {
            time = moment().local()
            this.timeElem.innerHTML = time.format("DD-MM-YYYY hh:mm:ss A")
        }, 1000)
    }
}
