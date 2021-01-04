export default class Map {
  constructor() {
    this.name = "map";
    this.tilemap = [];
    this.tilemap2 = [];
    this.isDrawn = 0;
    this.numberLayers;
    this.mapHeight;
    this.mapWidth;
    this.numberTiles;
    this.tileset;
    this.tilesHeight;
    this.tilesWidth;
    this.posX;
    this.posY;
    this.sprites = [];
    this.spritesSupport = []; // platform
    this.proceduralGeneration = [];
  }
}