import Model from "./model.js";
import Character from "./utils/character.js";
import View from "./view.js"

export default class Controller {
  constructor() {
    this.model = new Model();
    this.view = new View(this.model.nbPlayers);

    this.charactersNames = ["luffy", "pikachu", "naruto", "Valider.",  "Retour au menu principal."];
    this.charactersUrls = ["./assets/menu/luffy_choix.png", "./assets/menu/pikachu_choix.png", "./assets/menu/naruto_choix.png"];
    this.selectionMenu = [this.validate, this.backToMainMenu];
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// Partie Menu //////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Menu d'accueil qui permet de choisir un ou deux joueurs.
   */
  mainMenu() {
    let container = document.createElement("div"), welcomeText = document.createElement("p");
    container.className = "mainMenu";
    welcomeText.innerHTML = "Bienvenue dans notre crossover !<br><br>Choisissez une option : ";
    container.appendChild(welcomeText);  
    let sectionNames = ["1 Joueur", "2 Joueurs"], urls = ["", ""], sectionFunctions = [this.onePlayer, this.twoPlayers];
    for (let i = 0; i < 2; i++) {
      let btn = this.addButton(sectionNames[i], urls[i], sectionFunctions[i]);
      container.appendChild(btn);
    }
    document.body.appendChild(container);
  }

  /**
   *  Pour ajouter un bouton sur le body.
   * @param {String} sectionName : nom du bouton.
   * @param {String} url : path de l'image (utiliser pour la sélection des personnages).
   * @param {String} sectionFunction : fonction associée au bouton.
   */
  addButton(sectionName, url, sectionFunction) {
    let btn = document.createElement("button");
    let text = document.createTextNode(sectionName);
    if(url){
      let image = new Image();
      image.src = url;
      btn.appendChild(image);
    } else {
      btn.appendChild(text);
    } 
    if(sectionFunction == this.getCharacter1 || sectionFunction == this.getCharacter2)
      btn.addEventListener("click", sectionFunction.bind(this, text));
    else
      btn.addEventListener("click", sectionFunction.bind(this));
    return btn;
  }

  /**
   * Méthode pour enlever tous les éléments du body.
   */
  clean(){
    while(document.body.childNodes.length)
      document.body.removeChild(document.body.firstChild);
  }

  /**
   * Retour au menu principal.
   */
  backToMainMenu() {
    this.clean();
    this.stop();
    this.mainMenu();
  }

  /**
   * Pour récupérer le personnage choisi par le premier joueur.
   * @param {TextNode} character : personnage choisi.
   */
  getCharacter1(character) {
    this.model.choosenFirstCharacter = character.nodeValue;
  }

  /**
   * Pour récupérer le personnage choisi par le deuxième joueur.
   * @param {TextNode} character : personnage choisi.
   */
  getCharacter2(character) {
    this.model.choosenSecondCharacter = character.nodeValue;
  }

  // Les boutons pour sélectionner un personnage.
  addCharactersButtons(selectionText, getFunction) {
    let container = document.createElement("div");
    container.appendChild(selectionText);    
    for (let i = 0; i < 3; i++) {
      let btn = this.addButton(this.charactersNames[i], this.charactersUrls[i], getFunction);
      container.appendChild(btn);
    }
    document.body.appendChild(container);
  }

  /**
   * Méthode pour ajouter les boutons valider et de retour.
   */
  addSelectionButtons() {
    let containerInteraction = document.createElement("div");
    for (let i = 0; i < 2; i++) {
      let btn = this.addButton(this.charactersNames[i+3], "", this.selectionMenu[i]);
      btn.style.width = "400px";
      btn.style.height = "70px";
      
      containerInteraction.appendChild(btn);
    }
    document.body.appendChild(containerInteraction);
  }

  /**
   * Méthode lancée s'il y a qu'un joueur.
   */
  onePlayer() {
    this.clean();
    this.model.nbPlayers = 1;
    let textPlayer1 = document.createElement("p");
    textPlayer1.innerHTML = "Joueur 1 : ";
    this.addCharactersButtons(textPlayer1, this.getCharacter1);
    this.addSelectionButtons();
  }

  /**
   * Méthode lancée s'il y a deux joueurs.
   */
  twoPlayers() {
    this.clean();
    this.model.nbPlayers = 2;
    let textPlayer1 = document.createElement("p"), textPlayer2 = document.createElement("p");
    textPlayer1.innerHTML = "Joueur 1 : ";
    textPlayer2.innerHTML = "Joueur 2 : ";
    this.addCharactersButtons(textPlayer1, this.getCharacter1);
    this.addCharactersButtons(textPlayer2, this.getCharacter2);
    this.addSelectionButtons();
  }

  /**
   * Pour lancer le jeu.
   */
  validate(){
    this.clean();
    let valid = this.addButton("", "./assets/menu/arrow_left.png", this.backToMainMenu);
    this.view.camera1 = 0;
    valid.style.width = "70px";
    valid.style.height = "35px";
    valid.style.padding = "0px";
    document.body.appendChild(valid);
    this.load();
  }

  //////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////// Partie jeu ///////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////////////////

  async load() {
    await this.initMap();
    await this.initCharacters();
    document.body.appendChild(this.view.canvas);
    if(this.model.nbPlayers == 2)
      document.body.appendChild(this.view.canvas2);

    this.start();
  }

  /**
   * Démarrage du programme avec comme pointeur la fonction loop.
   */
  start() {
    this.loopPointer = window.requestAnimationFrame(stamp => this.loop(stamp));
  }

  /**
   * Arrêt de l'appelle en boucle de la fonction loop.
   */
  stop() {
    window.cancelAnimationFrame(this.loopPointer);
  }

  /**
   * Boucle de frame.
   * @param {Number} stamp - garde le pointeur de la fonction.
   */
  loop(stamp) {
    this.loopPointer = window.requestAnimationFrame(stamp => this.loop(stamp));
    this.view.draw(this.model);

    this.checking1(this.model.map.tilemap, this.view.canvas);

    if(this.model.nbPlayers == 2)
      this.checking2(this.model.map.tilemap2, this.view.canvas2);

   
  }

  checking1(tilemap, canvas) {

    if(this.model.character1.posX > 46) {
      tilemap[13 * canvas.width + 380] = 162;
      this.model.character1.win();
    }

    if(this.model.character1.move == "jump"){
      this.model.character1.jump();
    }
    // Pour faire avancer la caméra de la map
    if(this.model.character1.posX > 20 && this.view.camera1 < 335){
      this.view.camera1 += 1;
      this.model.character1.posX -= 0.5;
    }
    // Si le personnage se trouve sur un sprite empêchant de tomber
    if(!this.model.map.spritesSupport.includes(this.model.map.tilemap[(this.model.character1.posY + 2) * this.view.canvas.width + Math.round(this.model.character1.posX + this.view.camera1) + 1])) {
      this.model.character1.move = "fall";
      this.model.character1.fall();
    }
    // Retour case départ quand il tombe
    if (this.model.character1.posY > this.model.map.mapHeight){
      this.model.character1.posX = 0;
      this.view.camera1 = 0;
      this.model.character1.posY = 12;
      this.model.character1.move = "stand";
    }

    if (this.model.character1.move == "fall" && (this.model.character1.posY > this.model.map.mapHeight || (this.model.map.spritesSupport.includes(this.model.map.tilemap[(this.model.character1.posY + 2) * this.view.canvas.width + Math.round(this.model.character1.posX + this.view.camera1) + 1])))){
      this.model.character1.move = "stand";
    }
  }

  checking2(tilemap, canvas) {
    if(this.model.character2.posX > 46) {
      tilemap[13 * canvas.width + 380] = 162;
      this.model.character2.win();
    }

    if(this.model.character2.move == "jump"){
      this.model.character2.jump();
    }
    // Pour faire avancer la caméra de la map
    if(this.model.character2.posX > 20 && this.view.camera2 < 335){
      this.view.camera2 += 1;
      this.model.character2.posX -= 0.5;
    }
    // Si le personnage se trouve sur un sprite empêchant de tomber
    if(!this.model.map.spritesSupport.includes(this.model.map.tilemap2[(this.model.character2.posY + 2) * this.view.canvas.width + Math.round(this.model.character2.posX + this.view.camera2) + 1])) {
      this.model.character2.move = "fall";
      this.model.character2.fall();
    }
    // Retour case départ quand il tombe
    if (this.model.character2.posY > this.model.map.mapHeight){
      this.model.character2.posX = 0;
      this.view.camera2 = 0;
      this.model.character2.posY = 12;
      this.model.character2.move = "stand";
    }

    if (this.model.character2.move == "fall" && (this.model.character2.posY > this.model.map.mapHeight || (this.model.map.spritesSupport.includes(this.model.map.tilemap2[(this.model.character2.posY + 2) * this.view.canvas.width + Math.round(this.model.character2.posX + this.view.camera2) + 1])))){
      this.model.character2.move = "stand";
    }
  }

  async initMap() {
    await this.model.setMap();
    this.proceduralGeneration();
  }

  async initCharacters() {
    let conf = await fetch("../assets/atlas/" + this.model.choosenFirstCharacter + ".json");
    let characterJson = await conf.json();
    let spritesheet = await this.model.pic("../assets/atlas/" + characterJson["meta"]["image"]);
    this.setCharacter(characterJson, spritesheet, 1);

    if(this.model.nbPlayers == 2) {
      conf = await fetch("../assets/atlas/" + this.model.choosenSecondCharacter + ".json");
      characterJson = await conf.json();
      spritesheet = await this.model.pic("../assets/atlas/" + characterJson["meta"]["image"]);
      this.setCharacter(characterJson, spritesheet, 2);
    }
  }

  /**
   * Génération de la map.
   */
  proceduralGeneration() {
    this.initSprite(this.view.context);
    this.setBackground(Math.floor(Math.random() * 3), this.view.canvas, this.model.map.tilemap);
    this.setCourse(this.view.canvas, this.model.map.tilemap);
      
    if(this.model.nbPlayers == 2) {
      this.initSprite(this.view.context2);
      this.setBackground(Math.floor(Math.random() * 3), this.view.canvas2, this.model.map.tilemap2);
      this.setCourse(this.view.canvas2, this.model.map.tilemap2);
    }
  }

  /**
   * Initialisation des sprites qui vont être utilisé pour la map du jeu.
   */
  initSprite(context) {
    context.drawImage(this.model.map.tileset, 0, 0, this.model.map.tileset.width, this.model.map.tileset.height);
    for (let y = 0; y < this.model.map.tileset.height/this.model.map.tilesHeight; y++) {
      for (let x = 0; x < this.model.map.tileset.width/this.model.map.tilesWidth; x++) {
        this.model.map.sprites.push(
          context.getImageData(
            x * this.model.map.tilesWidth, y * this.model.map.tilesHeight,
            this.model.map.tilesWidth, this.model.map.tilesHeight
          )
        );
      }
    }
  }

  /**
   * Initialisation du fond de la map.
   * @param {Number} randomNumber : nombre associé à un ensemble de sprite pour le décors
   */
  setBackground(randomNumber, canvas, tilemap) {
    let tilesBackground = randomNumber == 0 ? [30, 29, 70, 69] : randomNumber == 1 ? [110, 109, 150, 149] : randomNumber == 2 ? [190, 189, 230, 229] : [];
    
    for (let y = 0; y+1 < this.model.map.sizeHeight; y+=2) {
      for (let x = 0; x+1 < this.model.map.sizeWidth; x+=2) {
        tilemap[y * canvas.width + x] = tilesBackground[0];
        tilemap[y * canvas.width + (x+1)] = tilesBackground[1];
        tilemap[(y+1) * canvas.width + x] = tilesBackground[2];
        tilemap[(y+1) * canvas.width + (x+1)] = tilesBackground[3];
      }
    }
    tilemap[13 * canvas.width + 380] = 161;
  }

  /**
   * Initialisation du parcours.
   */
  setCourse(canvas, tilemap) {
    let y = 14,
      sprite = this.model.map.spritesSupport[Math.floor(Math.random()*this.model.map.spritesSupport.length)];
    for (let x = 0; x < this.model.map.sizeWidth; x++) {
      let randNumber = Math.floor(Math.random() * 2),
          maxX = x + 5;
      if(randNumber == 1 || x < 5 || x > 375) {
        for(x -= 1; x < maxX; x++){
          tilemap[y * canvas.width + x] = sprite;
        }
      } else{
        for(x -= 1; x < maxX; x++){
          tilemap[(y - 5) * canvas.width + x] = sprite;
        }
      }
    }
  }

  /**
   * Initialisation des personnages.
   * @param {*} characterJson : fichier json du personnage.
   * @param {*} spritesheet : ensemble des sprites du perso.
   */
  setCharacter(characterJson, spritesheet, player) {
    if(player == 1) {
      this.model.character1 = new Character(characterJson, spritesheet, this.model.choosenFirstCharacter, 0, this.lastSprites(this.model.choosenFirstCharacter));
      this.setSprites(this.model.character1 , this.model.choosenFirstCharacter);
    }

    else if(player == 2) {
      this.model.character2 = new Character(characterJson, spritesheet, this.model.choosenSecondCharacter, 0, this.lastSprites(this.model.choosenSecondCharacter));
      this.setSprites(this.model.character2 , this.model.choosenSecondCharacter);
    }
  }

  setSprites(character) {
    character.posX = 0;
    character.posY = 12;
    this.addSprites(character, character.name, "walk", character.lastSprites.walk);
    this.addSprites(character, character.name, "stand", character.lastSprites.stand);
    this.addSprites(character, character.name, "run", character.lastSprites.run);
    this.addSprites(character, character.name, "fall", character.lastSprites.fall);
    this.addSprites(character, character.name, "jump", character.lastSprites.jump);
    this.addSprites(character, character.name, "win", character.lastSprites.win);
  }

  addSprites(character, nameCharacter, moveType, toGetLastSprites) {
    character.addSprites(
      moveType, 
      toGetLastSprites,
      nameCharacter+"_"+ moveType, 
      this.setPosX(character.name, moveType),
      this.setPosY(character.name, moveType)
    );
  }

  lastSprites(character) {
    if(character == "pikachu") {
      return {walk: 5, stand : 1, fall : 1, run : 5, jump : 7, win : 10};
    } else if(character == "naruto") {
      return {walk: 6, stand : 1, fall : 1, run : 10, jump : 7, win : 15};
    } else if(character == "luffy") {
      return {walk: 5, stand : 1, fall : 1, run : 8, jump :6, win : 8};
    }
  }

  setPosX(character, state) {
    if(character == "pikachu") {
      return state == "walk" ? [0.1, 0.1, 0.1, 0.6, 0.1] : state == "run" ? 0.5 : 1;
    } else if(character == "naruto") {
      return state == "walk" ? [0.6, 0.1, 0.1, 0.2, 0.1, 0.1] : state == "run" ? 0.5 : 1;
    } else if(character == "luffy") {
      return state == "walk" ? [0.1, 1, 0.1, 0.1, 1] : state == "run" ? 0.5 : 1;
    }
  }

  /**
   * Pour adapter l'ordonnée du sprite avec la Map.
   * @param {*} character 
   * @param {*} state : walk, jump, run...
   */
  setPosY(character, state) {
    if(character == "pikachu") {
      return state == "walk" ? [0, -0.1, 0, -0.2, 0] : state == "run" ? 0.3 : state == "jump" ? [-0.7, -0.7, -10, -10, -10, -7, -5] : state == "win" ? -0.4 : 0;
    } else if(character == "naruto") {
      return state == "walk" ? -1.8 : state == "run" ? -1 : state == "jump" ? [-0.7, -0.7, -10, -10, -10, -7, -5] : state == "win" ? [-3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -3, -1, -1, -1] : -1.6;
    } else if(character == "luffy") {
      return state == "walk" ? -2 : state == "run" ? -1.3 : state == "jump" ? [-1.8, -1.8, -7, -7, -7, -10] : -1.8;
    }
  }

  keydownFunction(e) {
    switch(e.code) {
      case "ArrowRight":
        this.arrowRightMovement(this.model.character1);
        this.model.pressed = true;
        break;
      case "ArrowUp":
        this.arrowUpMovement(this.model.character1);
        break;
      case "KeyW":
        this.arrowUpMovement(this.model.character2);
        break;
      case "KeyS":
        if(this.model.character2.move != "fall" && this.model.character2.move != "jump" && this.model.character2.move != "win") 
          this.model.character2.walk();
        break;
      case "KeyD":
        if(this.model.character2.move != "fall" && this.model.character2.move != "jump" && this.model.character2.move != "win") 
          this.model.character2.run();
        break;
    }
  }

  keyupFunction(e) {
    switch(e.code) {
      case "ArrowRight":
        this.model.pressed = false;
        if(this.model.character1.move != "fall" && this.model.character1.move != "jump" && this.model.character1.move != "win")
          if(this.model.character1.move != "walk")
            this.model.character1.stand();
        break;
    }
    
  }

  arrowRightMovement(character) {
    if(character.move != "fall" && character.move != "jump" && character.move != "win") {
      if(this.model.pressed) {
          character.run();
      } else {
        character.walk();
      }
    }
  }

  arrowUpMovement(character) {
    character.state = 0;
    character.jump();
  }
}