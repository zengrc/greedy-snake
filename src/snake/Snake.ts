import Game, { GameObject } from './Game';
import Map, { CELL_TYPE } from './Map';
import Foods from './Food';

import Cube from './Cube';

export enum DIRECTION {
  LEFT = -1,
  RIGHT = 1,
  UP = -2,
  DOWN = 2,
}

class SnakePoint extends Cube {
  constructor(game: Game, map: Map, rowIdx: number, colIdx: number) {
    super(game, map, rowIdx, colIdx, CELL_TYPE.SNAKE, 'logo');
  }
}

export default class Snake extends GameObject {
  items: SnakePoint[] = [];
  map: Map;
  game: Game;
  foods: Foods;
  onGameOver = () => { /* */ }
  private direction: DIRECTION = DIRECTION.RIGHT;
  private _direction: DIRECTION = DIRECTION.RIGHT;

  constructor(game: Game, map: Map, foods: Foods) {
    super();
    this.map = map;
    this.game = game;
    this.foods = foods;
    this.reset();
  }

  reset() {
    this.items = [
      new SnakePoint(this.game, this.map, 2, 1),
      new SnakePoint(this.game, this.map, 2, 2),
      new SnakePoint(this.game, this.map, 2, 3)
    ];
    this.direction = this._direction = DIRECTION.RIGHT;
  }

  changeDirection(direction: DIRECTION) {
    if ((direction + this._direction) === 0) return; // 不能调转方向
    this.direction = direction;
  }

  private snakeMove(rowIdx: number, colIdx: number) {
    const cellType = this.map.getCellType(rowIdx, colIdx);
    const newItem = new SnakePoint(this.game, this.map, rowIdx, colIdx);
    if (cellType === CELL_TYPE.SNAKE) {
      this.onGameOver();
      return;
    }
    // 每个点往前挪
    this.map.updateCellType(this.items[0].rowIdx, this.items[0].colIdx, CELL_TYPE.EMPTY);
    this.items.forEach((item, index) => {
      const nextIdx = index + 1;
      if (nextIdx < this.items.length) {
        item.updatePoint(this.items[nextIdx]);
      } else {
        item.updatePoint(newItem);
      }
    });
    this.map.updateCellType(newItem.rowIdx, newItem.colIdx, CELL_TYPE.SNAKE);
    if (cellType === CELL_TYPE.FOOD) {
      // 吃到食物变成，队首插一个新元素，颜色和食物相同
      const foodItem = this.foods.eat(newItem);
      if (foodItem) {
        const newTailItem = new SnakePoint(this.game, this.map, foodItem.rowIdx, foodItem.colIdx);
        // 变色并加到末尾
        newTailItem.texture = foodItem.texture;
        this.items.unshift(newTailItem);
      }
      return;
    }
  }

  private moveRight() {
    const lastItem = this.items[this.items.length - 1];
    const newCol = (lastItem.colIdx + 1) % this.map.col;
    this.snakeMove(lastItem.rowIdx, newCol)
  }

  private moveLeft() {
    const lastItem = this.items[this.items.length - 1];
    const newCol = (lastItem.colIdx - 1 + this.map.col) % this.map.col;
    this.snakeMove(lastItem.rowIdx, newCol)
  }
  
  private moveUp() {
    const lastItem = this.items[this.items.length - 1];
    const newRow = (lastItem.rowIdx - 1 + this.map.row) % this.map.row;
    this.snakeMove(newRow, lastItem.colIdx)
  }

  private moveDown() {
    const lastItem = this.items[this.items.length - 1];
    const newRow = (lastItem.rowIdx + 1) % this.map.row;
    this.snakeMove(newRow, lastItem.colIdx)
  }

  move() {
    if (!this.items.length) return;
    // 真正move的时候才更新，防止手速过快的用户点击
    this._direction = this.direction;
    switch(this.direction) {
      case DIRECTION.RIGHT:
        this.moveRight()
        break;
      case DIRECTION.LEFT:
        this.moveLeft();
        break;
      case DIRECTION.UP:
        this.moveUp();
        break;
      case DIRECTION.DOWN:
        this.moveDown();
        break;
      default:
        break;
    }
  }
}