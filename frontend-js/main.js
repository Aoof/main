import VerySecretCompartment from "./modules/verysecretcompartment";
import FaeGrimoire from "./modules/FaeGrimoire";

if (document.querySelector("#vsc")) {
    new VerySecretCompartment()
}

if (document.querySelector(".fae-grimoire")) {
    new FaeGrimoire();
}