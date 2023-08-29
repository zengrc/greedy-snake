import Game, { GameItem } from './Game';
import Map, { CELL_TYPE } from './Map';

export default class Point extends GameItem {
  red = 0.5;
  green = 0.5;
  blue = 0.5;
  static CellSize = 20;
  scale = 2;
  rowIdx: number;
  colIdx: number;
  game: Game;
  map: Map;

  get cellType() {
    return this.map.getCellType(this.rowIdx, this.colIdx);
  }

  constructor(game: Game, map: Map, rowIdx: number, colIdx: number, type = CELL_TYPE.EMPTY) {
    super('point', Point.CellSize * colIdx + Point.CellSize / 2, Point.CellSize * rowIdx + Point.CellSize / 2);
    this.rowIdx = rowIdx;
    this.colIdx = colIdx;
    this.game = game;
    this.map = map;
    this.map.updateCellType(this.rowIdx, this.colIdx, type);
  }

  updatePoint(point: Point) {
    this.scale = point.scale;
    this.colIdx = point.colIdx;
    this.rowIdx = point.rowIdx;
    this.x = point.x;
    this.y = point.y;
    this.translateX = point.translateX;
    this.translateY = point.translateY;
    this.texture = point.texture;
  }
}