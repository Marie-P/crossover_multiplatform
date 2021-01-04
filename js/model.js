import Map from "./utils/map.js"

export default class Model {
  constructor() {
    this.nbPlayers = 2;
    this.map = new Map();
    this.choosenFirstCharacter = "pikachu";
    this.choosenSecondCharacter = "luffy";
    this.character1;
    this.character2;

    this.pressed = false;
  }

  /**
   * Initialisation de tous les éléments de la map.
   */
  async setMap() {
    this.map.tileset = await this.pic("../assets/tilesets/mines_of_sharega.png");
    this.map.numberLayers = 1;
    this.map.mapHeight = 30;
    this.map.mapWidth = 80;
    this.numberTiles = 1;
    this.map.tilesHeight = 16;
    this.map.tilesWidth = 16;
    this.map.posX = 0;
    this.map.posY = 0;
    this.map.spritesSupport = [50, 130, 90];
    this.map.sizeHeight = 3200;
    this.map.sizeWidth = 400;
    this.initMap();
  }

  /**
   * Charger une image à partir du chemin.
   * @param {string} url - chemin de l'image.
   */
  pic(url) {
    return new Promise (resolve => {
      let img = document.createElement("img");
      img.setAttribute("src", url);
      img.onload = () => resolve(img);
    })
  }

  initMap() {
    for (let y = 0; y < this.map.sizeHeight; y++) {
      for (let x = 0; x < this.map.sizeWidth; x++) {
        this.map.tilemap.push(4);
        if (this.nbPlayers == 2)
          this.map.tilemap2.push(4);
      }
    }
  }
}