export default class View {
  constructor(player) {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 250;
    this.camera1 = 0;

    if(player == 2) {
      this.canvas2 = document.createElement("canvas");
      this.context2 = this.canvas2.getContext("2d");
      this.canvas2.width = 800;
      this.canvas2.height = 250;
      this.camera2 = 0;
    }
  }

  /**
   * dessiner la map
   * @param {Model} model 
   */
  drawMap(model, canvas, context, tilemap, camera) {
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        context.putImageData(
          model.map.sprites[tilemap[y * canvas.width + (x + camera)]],
          x * model.map.tilesWidth, y * model.map.tilesHeight
        );
      }
    }
  }

  drawCharacter(context, model, character) {
    let x = character.posX,
        y = character.posY + (character.sprites.get(character.move).posY[character.state]);
    // console.log((character.sprites.get(character.move).posY[character.state]));
    context.drawImage(
      character.sprites.get(character.move).sprites[character.state], 
      x * model.map.tilesWidth, y * model.map.tilesWidth
    );
  }

  draw(model) {
    this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    this.drawMap(model, this.canvas, this.context, model.map.tilemap, this.camera1);
    
    // dessin sur personnage

    this.drawCharacter(this.context, model, model.character1);

    if(model.nbPlayers == 2) {
      this.context2.clearRect(0,0,this.canvas.width, this.canvas.height);
      this.drawMap(model, this.canvas2, this.context2, model.map.tilemap2, this.camera2);
      // dessin sur personnage
    // let character1 = model.character1,  x = character1.posX,
    //     y = character1.posY + (character1.sprites.get(character1.move).posY[character1.state]);
    //   // console.log(character1.state);
    //   this.context.drawImage(
    //     character1.sprites.get(character1.move).sprites[character1.state], 
    //     x * model.map.tilesWidth, y * model.map.tilesWidth
    //   );

      this.drawCharacter(this.context2, model, model.character2);
    }


  }
}