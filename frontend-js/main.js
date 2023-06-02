import VerySecretCompartment from "./modules/verysecretcompartment"
import Clock from "./modules/clock"

if (document.querySelector("#vsc")) {
    new VerySecretCompartment()
}

if (document.querySelector(".clock")) {
    new Clock()
}