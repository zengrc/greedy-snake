import Game, { GameItem } from './Game';
import Map, { CELL_TYPE } from './Map';

export default class Cube extends GameItem {
  red = 0.5;
  green = 0.5;
  blue = 0.5;
  static CellSize = 20;
  scale = 1;
  width = 10;
  height = 10;
  rowIdx: number;
  colIdx: number;
  game: Game;
  map: Map;

  get cellType() {
    return this.map.getCellType(this.rowIdx, this.colIdx);
  }

  constructor(game: Game, map: Map, rowIdx: number, colIdx: number, type = CELL_TYPE.EMPTY, texture = '') {
    super('cube', Cube.CellSize * colIdx + Cube.CellSize / 2, Cube.CellSize * rowIdx + Cube.CellSize / 2);
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
    this.game = game;
    this.map = map;
    this.map.updateCellType(this.rowIdx, this.colIdx, type);
    this.texture = texture;
  }

  updatePoint(cube: Cube) {
    this.colIdx = cube.colIdx;
    this.rowIdx = cube.rowIdx;
    this.x = cube.x;
    this.y = cube.y;
    this.translateX = cube.translateX;
    this.translateY = cube.translateY;
    this.width = cube.width;
    this.height = cube.height;
  }
}