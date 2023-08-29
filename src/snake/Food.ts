import Game, { GameObject } from './Game';
import Map, { CELL_TYPE } from './Map';

import Cube from './Cube';

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class FoodPoint extends Cube {
  width = 6;
  height = 6;

  constructor(game: Game, map: Map, rowIdx: number, colIdx: number) {
    const foodID = getRandomInt(1, 4);

    super(game, map, rowIdx, colIdx, CELL_TYPE.FOOD, `food${foodID}`);
  }
}

export default class Foods extends GameObject {
  items: FoodPoint[] = [];
  map: Map;
  game: Game;
  private maxCount = 3;

  constructor(game: Game, map: Map) {
    super();
    this.game = game;
    this.map = map;
  }

  createFood() {
    if (this.items.length >= this.maxCount) return;
    const emptyCells = this.map.emptyCells;
    if (!emptyCells.length) return;
    const [newRowIdx, newColIdx] = emptyCells[getRandomInt(0, emptyCells.length - 1)];
    const newFood = new FoodPoint(this.game, this.map, +newRowIdx, +newColIdx);
    this.items.push(newFood);
  }

  eat(point: Cube) {
    const index = this.items.indexOf(this.items.filter(item => item.rowIdx === point.rowIdx && item.colIdx === point.colIdx)[0]);
    if (index > -1) {
      const deleteItem = this.items.splice(index, 1)[0];
      // 不需要destory snake会把这里的celltype变成snake
      return deleteItem;
    }
  }
}