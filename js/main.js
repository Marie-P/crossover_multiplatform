import Controller from "./controller.js";

window.addEventListener("load", async() => new Main());

class Main {
  constructor() {
    this.controller = new Controller();


    window.addEventListener("keydown", event => this.controller.keydownFunction(event));
    window.addEventListener("keyup", event => this.controller.keyupFunction(event));

    this.controller.mainMenu();
    // this.controller.load(); 
  }

}