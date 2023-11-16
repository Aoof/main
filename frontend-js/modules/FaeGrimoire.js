
export default class FaeGrimoire {
    constructor() {
        this.searchBar = document.querySelector(".search");
        this.popupBtns = document.querySelectorAll(".popup-btn");
        this.popupForms = document.querySelectorAll(".popup-form");
        this.events();
    }

    events() {
        this.searchBar.addEventListener("keyup", () => this.search());

        this.popupBtns.forEach(btn => {
            btn.addEventListener("click", () => this.togglePopup(btn));
        });
    }

    search() {
        document.querySelector(".test").innerText = this.searchBar.value;
    }
}