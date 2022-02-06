import jstz from "jstz";
import moment from "moment";

export default class VerySecretCompartment {
    constructor() {
        this.time = document.querySelector(".time .t")
        this.date = document.querySelector(".time .d")
        this.table = document.querySelector(".table tbody")
        this.getTimezone()
        this.events()
    }

    events() {
        this.tzTime = moment().local();
        let t = this.tzTime.format("h:m:s A")
        let d = this.tzTime.format("DD-MM-YYYY")
        this.time.innerHTML = t
        this.date.innerHTML = d
        
        this.showTable()
        this.showTime()
    }

    getTimezone() {
        let tz = jstz.determine() || "UTC";
        document.querySelector("#tz").innerHTML = tz.name();
    }

    showTime() {
        setInterval(() => {
            this.tzTime = moment().local();
            let t = this.tzTime.format("h:m:s A")
            let d = this.tzTime.format("DD-MM-YYYY")
            this.time.innerHTML = t
            this.date.innerHTML = d
        }, 1000);
    }

    showTable() {
        for (let i = 0; i < 24; i++) {
            let row = document.createElement("tr");

            const element = document.createElement("td");

            let newTime = (i < 10) ? "0" : ""
            newTime = newTime + JSON.stringify(i)
            let stamp = this.tzTime.format("YYYY-MM-DD") + "T" + newTime + ":00Z"
            console.log(stamp)
            let upTzTime = moment(stamp).utc()
            element.innerHTML = upTzTime.format("h:mm A");
        
            const element_2 = document.createElement("td");
            let timeLeft = upTzTime.from(this.tzTime)
            element_2.innerHTML = timeLeft;
            
            row.appendChild(element);
            row.appendChild(element_2);

            this.table.appendChild(row);
        }
    }
}