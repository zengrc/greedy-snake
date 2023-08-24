import Game, { GameObject } from './Game';
import Point from './Point';

export enum CELL_TYPE {
  SNAKE = 1,
  FOOD = 2,
  EMPTY = 0,
}

export default class Map extends GameObject {
  items: Point[] = [];
  col: number;
  row: number;
  private cellTypeMap: Record<string, CELL_TYPE> = {};
  keyDownCallback: (e: KeyboardEvent) => void = () => { /**/ };

  get emptyCells() {
    return Object.keys(this.cellTypeMap).filter(key => !this.cellTypeMap[key]).map(key => key.split(','));
  }

  constructor(game: Game) {
    super();
    this.col = Math.floor(game.width / Point.CellSize);
    this.row = Math.floor(game.height / Point.CellSize);
    for (let i = 0; i < this.row; i += 1) {
      for (let j = 0; j < this.col; j += 1) {
        this.items.push(new Point(game, this, i, j));
      }
    }
  }

  removeListeners() {
    document.body.removeEventListener('keydown', this.keyDownCallback.bind(this));
  }

  registerListeners(cb: (e: KeyboardEvent) => void) {
    this.removeListeners();
    this.keyDownCallback = cb;
    document.body.addEventListener('keydown', this.keyDownCallback.bind(this))
  }

  hasEmptyCell() {
    return this.emptyCells.length < this.row * this.col;
  }

  updateCellType(rowIdx: number, colIdx: number, type: CELL_TYPE) {
    this.cellTypeMap[`${rowIdx},${colIdx}`] = type;
  }

  getCellType(rowIdx: number, colIdx: number) {
    return this.cellTypeMap[`${rowIdx},${colIdx}`] || CELL_TYPE.EMPTY;
  }
}