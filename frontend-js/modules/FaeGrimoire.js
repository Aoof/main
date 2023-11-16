export default class FaeGrimoire {
    constructor() {
        this.searchBar = document.querySelector(".search");
        this.popupBtns = document.querySelectorAll(".popup-btn");
        this.popupForms = document.querySelectorAll(".popup-form");

        this.amount = document.querySelector(".ingredient-btns #ingredient-amount");
        this.name = document.querySelector(".ingredient-btns #ingredient-name");

        this.events();
    }

    events() {
        if (this.searchBar)
        {
            this.searchBar.addEventListener("keyup", () => this.search());
        }

        if (this.popupBtns)
        {
            this.popupBtns.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.togglePopup(btn);
                });
            });
        }

        if (document.querySelector("#add-recipe"))
        {
            this.setupAddRecipeForm();
        }

        document.addEventListener("keydown", e => {
            if (e.key == "Enter") {
                if (document.querySelector("#add-recipe")) {
                    e.preventDefault();
                }
            }
        })

        document.addEventListener("keyup", e => {
            if (e.key == "Enter") {
                if (document.querySelector("#add-recipe")) {
                    e.preventDefault();
                    this.addRecipe();
                }
            }
        })
    }

    search() {
        document.querySelector(".test").innerText = this.searchBar.value;
    }

    togglePopup(btn) {
        let popupId = btn.dataset.popupId;

        this.popupForms.forEach(form => {
            if (!form.classList.contains("hidden")) {
                form.classList.add("hidden");
            }

            form.querySelector(".hide-popup").addEventListener("click", e => {
                e.preventDefault();
                this.popupForms.forEach(form => {
                    if (!form.classList.contains("hidden")) {
                        form.classList.add("hidden");
                    }
                });
            });
        })
        
        switch (popupId) {
            case "add-recipe":
                this.toggleAddRecipePopup();
                break;
            case "edit-recipe":
                this.toggleEditRecipePopup();
                break;
            case "delete-recipe":
                this.toggleDeleteRecipePopup();
                break;
            default:
                console.log("Error: Invalid popup ID.");
                break;
        }
    }

    toggleAddRecipePopup() {
        window.location.href = "/fae-sparkles/add-recipe";
    }

    toggleEditRecipePopup() {
        let popup = document.querySelector("#edit-recipe");
        popup.classList.toggle("hidden");
    }

    toggleDeleteRecipePopup() {
        let popup = document.querySelector("#delete-recipe");
        popup.classList.toggle("hidden");
    }

    setupAddRecipeForm() {
        this.addRecipeForm = document.querySelector("#add-recipe form");
        this.addRecipeForm.addEventListener("submit", e => {
            e.preventDefault();
            this.addRecipe();
        });

        this.addIngredientBtn = document.querySelector(".btn-add-ingredient");
        if (this.addIngredientBtn)
        {
            this.addIngredientBtn.addEventListener("click", e => {
                e.preventDefault();
                this.addIngredient();
            });
        }

        this.cancelBtn = document.querySelector(".btn-cancel");
        if (this.cancelBtn)
        {
            this.cancelBtn.addEventListener("click", e => {
                e.preventDefault();
                window.location.href = "/fae-sparkles";
            });
        }

        this.tagGroup = document.querySelector(".form-display-tags");
        if (this.tagGroup)
        {
            this.tagGroup.addEventListener("keydown", e => {
                if (e.key == " " || e.key == "Enter") {
                    e.preventDefault();
                    let tag = document.createElement("div");
                    tag.classList.add("tag");
                    tag.innerHTML = `<span>${this.tagGroup.value}</span><button class="btn-remove-tag">-</button>`;
                    this.tagGroup.value = "";
                    this.tagGroup.parentElement.insertBefore(tag, this.tagGroup);
                }
            });
        }
    }

    addIngredient() {
        this.ingredientsList = document.querySelector(".ingredients-list");
        let ingredient = document.createElement("div");
        ingredient.classList.add("ingredient");
        ingredient.classList.add("grid");
        ingredient.innerHTML = `<input type="text" class="amount-input name col-3" placeholder="Amount" value="${this.amount.value}">
        <input type="text" class="ingredient-input amount col-8" placeholder="Ingredient" value="${this.name.value}">
        <button id="remove-ingredient" class="btn btn-remove-ingredient col-1">-</button>`;
        this.amount.value = "";
        this.name.value = "";
        this.amount.focus();
        this.ingredientsList.appendChild(ingredient);

        this.removeIngredientBtns = document.querySelectorAll(".btn-remove-ingredient");
        if (this.removeIngredientBtns)
        {
            this.removeIngredientBtns.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    btn.parentElement.remove();
                });
            });
        }
    }

    addRecipe() {
        let data = {
            title: document.querySelector("#title").value,
            ingredients: [],
            instructions: document.querySelector("#instructions").value,
            cookTime: document.querySelector("#cookTime").value
        };

        if (document.querySelector("#ingredient-name").value != "" && document.querySelector("#ingredient-amount").value != "") {
            this.addIngredient();
            return;
        }

        let ingredients = document.querySelectorAll(".ingredient");

        ingredients.forEach(ingredient => {
            let ingredientInput = ingredient.querySelector("#ingredient-name");
            let amountInput = ingredient.querySelector("#ingredient-amount");

            data.ingredients.push({
                ingredient: ingredientInput.value,
                amount: amountInput.value
            });
        });

        fetch("/fae-sparkles/add-recipe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        });
    }
}