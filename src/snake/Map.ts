import Game, { GameObject } from './Game';
import Point from './Point';
import Snake, { DIRECTION } from './Snake';
import Foods from './Food';

export enum CELL_TYPE {
  SNAKE = 1,
  FOOD = 2,
  EMPTY = 0,
}

export default class Map extends GameObject {
  items: Point[] = [];
  col: number;
  row: number;
  game: Game;
  snake: Snake;
  foods: Foods;
  private cellTypeMap: Record<string, CELL_TYPE> = {};

  get emptyCells() {
    return Object.keys(this.cellTypeMap).filter(key => !this.cellTypeMap[key]).map(key => key.split(','));
  }

  constructor(game: Game) {
    super();
    this.col = Math.floor(game.width / Point.CellSize);
    this.row = Math.floor(game.height / Point.CellSize);
    this.game = game;
    this.reset();
  }

  snakeMoveListener(event: KeyboardEvent) {
    const { code } = event;
    switch(code) {
      case 'ArrowUp':
        this.snake.changeDirection(DIRECTION.UP);
        break;
      case 'ArrowRight':
        this.snake.changeDirection(DIRECTION.RIGHT);
        break;
      case 'ArrowLeft':
        this.snake.changeDirection(DIRECTION.LEFT);
        break;
      case 'ArrowDown':
        this.snake.changeDirection(DIRECTION.DOWN);
        break;
    }
  }

  removeListeners() {
    document.body.removeEventListener('keydown', this.snakeMoveListener.bind(this));
  }

  registerListeners() {
    this.removeListeners();
    document.body.addEventListener('keydown', this.snakeMoveListener.bind(this))
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

  update() {
    this.snake.move();
    this.foods.createFood();
  }

  reset() {
    for (let i = 0; i < this.row; i += 1) {
      for (let j = 0; j < this.col; j += 1) {
        this.items.push(new Point(this.game, this, i, j));
      }
    }
    this.foods = new Foods(this.game, this);
    this.snake = new Snake(this.game, this, this.foods);
    this.children = [this.snake, this.foods];
    this.registerListeners();
  }
}