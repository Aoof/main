import axios from "axios";
export default class FaeGrimoire {
    constructor() {
        this.faeGrimoire = document.querySelector(".fae-grimoire");
        
        this.popupBtns = document.querySelectorAll(".popup-btn");
        this.popupForms = document.querySelectorAll(".popup-form");

        this.amount = document.querySelector(".ingredient-btns .ingredient-amount.main");
        this.name = document.querySelector(".ingredient-btns .ingredient-name.main");

        this.events();
    }

    events() {
        if (this.popupBtns)
        {
            this.popupBtns.forEach(btn => {
                btn.addEventListener("click", e => {
                    e.preventDefault();
                    this.togglePopup(btn);
                });
            });
        }

        if (document.querySelector("#add-recipe")) { this.setupAddRecipeForm(); }
        if (document.querySelector("#edit-recipe")) { this.setupEditRecipeForm(); }

        document.addEventListener("keydown", e => {
            if (e.key == "Enter") {
                if (document.querySelector("#add-recipe") || document.querySelector("#edit-recipe")) {
                    if (document.activeElement == document.querySelector("textarea")) return;
                    e.preventDefault();
                }
            }
        })

        document.addEventListener("keyup", e => {
            if (e.key == "Enter") {
                if (document.querySelector("#add-recipe")) {
                    if (document.activeElement == document.querySelector("textarea")) return;
                    e.preventDefault();
                    this.addUpdateRecipe();
                }

                if (document.querySelector("#edit-recipe")) {
                    if (document.activeElement == document.querySelector("textarea")) return;
                    e.preventDefault();
                    this.addUpdateRecipe();
                }
            }
        })
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
                this.toggleEditRecipePopup({
                    id: btn.dataset.recipeId,
                    title: btn.dataset.recipeTitle
                });
                break;
            case "delete-recipe":
                this.toggleDeleteRecipePopup({
                    id: btn.dataset.recipeId,
                    title: btn.dataset.recipeTitle
                });
                break;
            default:
                console.log("Error: Invalid popup ID.");
                break;
        }
    }

    toggleAddRecipePopup() {
        window.location.href = "/fae-sparkles/add-recipe";
    }

    toggleEditRecipePopup(recipe) {
        if (recipe == undefined) return;

        window.location.href = `/fae-sparkles/edit-recipe/${recipe.id}`;
    }

    toggleDeleteRecipePopup(recipe) {
        if (recipe == undefined) return;

        let id = recipe.id;
        let title = recipe.title;

        let popup = document.querySelector("#delete-recipe");
        popup.classList.toggle("hidden");

        let form = popup.querySelector("form");
        form.action = `/fae-sparkles/delete-recipe/${id}`;

        let recipeTitle = popup.querySelector(`#recipeTitle`);
        recipeTitle.innerText = title;

        let cancelBtn = popup.querySelector(".btn-cancel");
        cancelBtn.addEventListener("click", e => {
            e.preventDefault();
            popup.classList.toggle("hidden");
        });

        let deleteBtn = popup.querySelector(".btn-delete");
        deleteBtn.addEventListener("click", e => {
            e.preventDefault();
            form.submit();
        });
    }

    setupEditRecipeForm() {
        this.editRecipeForm = document.querySelector("#edit-recipe form");
        this.editRecipeForm.addEventListener("submit", e => {
            e.preventDefault();
            this.addUpdateRecipe();
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
                window.location.href = e.target.dataset.href;
            })
        }

        this.tagGroup = document.querySelector(".form-display-tags");
        if (this.tagGroup)
        {
            this.tagGroup.parentElement.parentElement.addEventListener("click", e => {
                e.preventDefault();
                this.tagGroup.focus();
            });

            this.tagGroup.addEventListener("keydown", e => {
                if (e.key == " " || e.key == "Enter") {
                    e.preventDefault();
                    if (this.tagGroup.value.trim() != "") {
                        this.addTag();
                    }
                }

                if (e.key == "Backspace" && this.tagGroup.value.trim() == "") {
                    let tags = document.querySelectorAll(".tag");
                    if (tags.length > 0) {
                        tags[tags.length - 1].remove();
                    }
                }
            });
        }

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

    setupAddRecipeForm() {
        this.addRecipeForm = document.querySelector("#add-recipe form");
        this.addRecipeForm.addEventListener("submit", e => {
            e.preventDefault();
            this.addUpdateRecipe();
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
            this.tagGroup.parentElement.parentElement.addEventListener("click", e => {
                e.preventDefault();
                this.tagGroup.focus();
            });

            this.tagGroup.addEventListener("keydown", e => {
                if (e.key == " ") {
                    e.preventDefault();
                    if (this.tagGroup.value.trim() != "") {
                        this.addTag();
                    }
                }

                if (!document.querySelector('.results-container.active')) {
                    if (e.key == "Enter") {
                        e.preventDefault();
                        if (this.tagGroup.value.trim() != "") {
                            this.addTag();
                        }
                    }
                }

                if (e.key == "Backspace" && this.tagGroup.value.trim() == "") {
                    let tags = document.querySelectorAll(".tag");
                    if (tags.length > 0) {
                        tags[tags.length - 1].remove();
                    }
                }
            });
        }

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

    addTag() {
        this.tags = document.querySelectorAll(".tag");
        this.tags = Array.from(this.tags).map(tag => tag.querySelector("span").innerText);

        if (this.tags.includes(this.tagGroup.value)) {
            this.tagGroup.value = "";
            return;
        }

        let tag = document.createElement("div");
        tag.classList.add("tag");
        tag.innerHTML = `<span>${this.tagGroup.value}</span><button class="btn-remove-tag">-</button>`;
        this.tagGroup.value = "";
        tag.addEventListener("click", e => {
            e.preventDefault();
            tag.remove();
        });
        this.tagGroup.parentElement.parentElement.insertBefore(tag, this.tagGroup.parentElement);
    }

    addIngredient() {

        this.ingredientsList = document.querySelector(".ingredients-list");
        let ingredient = document.createElement("div");
        ingredient.classList.add("ingredient");
        ingredient.classList.add("grid");
        ingredient.innerHTML = `<input type="text" class="ingredient-amount name col-3" placeholder="Amount" value="${this.amount.value}">
        <input type="text" class="ingredient-name amount col-8" placeholder="Ingredient" value="${this.name.value}">
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

    addUpdateRecipe() {
        this.faeGrimoire = document.querySelector(".fae-grimoire");
        let action = this.faeGrimoire.querySelector("form").action;

        let data = {
            title: document.querySelector("#title").value,
            foodType: document.querySelector("#foodType").value,
            ingredients: [],
            tags: [],
            instructions: document.querySelector("#instructions").value,
            cookTime: document.querySelector("#cookTime").value
        };

        if (document.querySelector(".ingredient-name.main").value.trim() != "" && document.querySelector(".ingredient-amount.main").value.trim() != "") {
            this.addIngredient();
            return;
        }

        if (document.querySelector(".form-display-tags").value.trim() != "") {
            this.addTag();
            return;
        }

        let tags = document.querySelectorAll(".tag");

        tags.forEach(tag => {
            data.tags.push(tag.querySelector("span").innerText);
        });

        let ingredients = document.querySelectorAll(".ingredient:not(.default)");

        ingredients.forEach(ingredient => {
            let ingredientInput = ingredient.querySelector(".ingredient-name");
            let amountInput = ingredient.querySelector(".ingredient-amount");

            data.ingredients.push({
                ingredient: ingredientInput.value,
                amount: amountInput.value
            });
        });

        if (data.title == "") {
            this.showErrorMessage("You must provide a title.");
            return;
        }

        if (data.ingredients.length == 0) {
            this.showErrorMessage("You must provide ingredients.");
            return;
        }

        if (data.instructions == "") {
            this.showErrorMessage("You must provide instructions.");
            return;
        }

        if (data.cookTime == 0) {
            this.showErrorMessage("You must provide a cook time.");
            return;
        }

        let csrf = document.querySelector("input[name='_csrf']").value;

        data._csrf = csrf;

        axios.post(action, data).then((response) => {
            if (typeof response.data == "string") {
                window.location.href = "/fae-sparkles";
            } else {
                this.showErrorMessage(response);
            }
        }).catch(e => {
            console.log(e);
            this.showErrorMessage(e.response.data);
        });
    }

    showErrorMessage(err) {
        let error = document.createElement("div");
        error.classList.add("alert");
        error.classList.add("alert-danger");

        error.addEventListener("click", e => {
            e.preventDefault();
            error.remove();
        });

        error.innerHTML = `${err}<button class="close">&times;</button>`;

        this.faeGrimoire.insertBefore(error, this.faeGrimoire.firstChild);
    }
}