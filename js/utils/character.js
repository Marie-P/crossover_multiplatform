export default class Character {
  constructor (json, spritesheet, name, state, lastSprites) {
    this.name = name;
    this.json = json;
    this.state = state;
    this.lastSprites = lastSprites;
    this.sprites = new Map();
    this.sprites.set("walk", {posX: [], posY: [], sprites: []});
    this.sprites.set("stand", {posX: [], posY: [], sprites: []});
    this.sprites.set("run", {posX: [], posY: [], sprites: []});
    this.sprites.set("fall", {posX: [], posY: [], sprites: []});
    this.sprites.set("jump", {posX: [], posY: [], sprites: []});
    this.sprites.set("win", {posX: [], posY: [], sprites: []});
    this.posX;
    this.posY;
    this.move = "stand";
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.json["meta"]["size"]["w"];
    this.canvas.height = this.json["meta"]["size"]["h"];
    this.context = this.canvas.getContext("2d");
    this.context.drawImage(spritesheet, 0, 0, this.canvas.width, this.canvas.height);
  }

  addSprites(moveType, lastSprite, prefix, posX, posY) {
    for(let i = 1; i <= lastSprite ; i++){
      let name = prefix;
      if(i < 10)
        name += "_0"+i+".png";
      else
        name += "_"+i+".png";
      let x = this.json["frames"][name]["frame"]["x"];
      let y = this.json["frames"][name]["frame"]["y"];
      let w = this.json["frames"][name]["frame"]["w"];
      let h = this.json["frames"][name]["frame"]["h"];
      
      let animeImageData = this.context.getImageData(x, y, w, h);
      let canvasAnime = document.createElement('canvas');
      canvasAnime.width = w;
      canvasAnime.height = h;
      let contextSprite = canvasAnime.getContext("2d");
      contextSprite.putImageData(animeImageData, 0, 0);

      this.sprites.get(moveType).sprites.push(canvasAnime);

      if(Array.isArray(posY))
        this.sprites.get(moveType).posY.push(posY[i - 1]);
      else 
        this.sprites.get(moveType).posY.push(posY);
      

      if(Array.isArray(posX))
        this.sprites.get(moveType).posX.push(posX[i - 1]);
      else 
        this.sprites.get(moveType).posX.push(posX);
      
    } 
  }

  walk() {
    this.move = "walk";
    this.state = this.state >= this.lastSprites.walk - 1 ? 0 : this.state + 1;
    this.posX += this.sprites.get(this.move).posX[this.state];
  }

  stand() {
    this.move = "stand";
    this.state = 0;
  }

  run() {
    this.move = "run";
    this.state = this.state >= this.lastSprites.run - 1 ? 0 : this.state + 1;
    this.posX += this.sprites.get(this.move).posX[this.state];
  }

  fall() {
    if(this.move != "jump") {
      this.move = "fall";
      this.state = 0;
      this.posY ++;
    }
      
  }

  jump() {
    this.move = "jump";
    this.state = this.state >= this.lastSprites.jump - 1 ? 0 : this.state + 1;
    if(this.state == this.lastSprites.jump -1){
      this.posX += 2;
      this.posY -= 5;
      this.move = "stand";
      this.state = 0;
    }
  }

  win() {
    this.move = "win";
    this.state = this.state >= this.lastSprites.win - 1 ? this.lastSprites.win - 1 : this.state + 1;
  }
}