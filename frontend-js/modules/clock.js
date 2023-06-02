
export default class Clock {
    constructor() {
        this.clock = document.querySelector(".clock");

        this.events()
    }

    events() {
		this._element = this.clock;
		var html = '';
		for (var i=0;i<6;i++) {
			html += '<span>&nbsp;</span>';
		}
		this._element.innerHTML = html;
		this._slots = this._element.getElementsByTagName('span');
		this._tick();
    }

    _tick() {
        var time = new Date();
        this._update(this._pad(time.getHours()) + this._pad(time.getMinutes()) + this._pad(time.getSeconds()));
        var self = this;
        setTimeout(function(){
            self._tick();
        },1000);
    }

    _pad(value) {
        return ('0' + value).slice(-2);
    }

    _update(timeString) {

        var i = 0, l = this._slots.length, value, slot, now;
        for (; i < l; i++) {

            value = timeString.charAt(i);
            slot = this._slots[i];
            now = slot.dataset.now;

            if (!now) {
                slot.dataset.now = value;
                slot.dataset.old = value;
                continue;
            }

            if (now !== value) {
                this._flip(slot, value);
            }
        }
    }

    _flip(slot, value) {

        // setup new state
        slot.classList.remove('flip');
        slot.dataset.old = slot.dataset.now;
        slot.dataset.now = value;

        // force dom reflow
        slot.offsetLeft;

        // start flippin
        slot.classList.add('flip');

    }
}