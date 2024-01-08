import './styles/main.scss';
import VerySecretCompartment from "./modules/verysecretcompartment";
import FaeGrimoire from "./modules/FaeGrimoire";
import FilterPagination from "./modules/FilterPagination";
import AutoComplete from "./modules/AutoComplete";

if (document.querySelector("#vsc")) {
    new VerySecretCompartment()
}

if (document.querySelector(".fae-grimoire")) {
    new FaeGrimoire();
}

if (document.querySelector(".pagination")) {
    new FilterPagination();
}

if (document.querySelector(".auto-complete")) {
    new AutoComplete();
}