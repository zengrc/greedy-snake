<template>
  <div class="btn" @click="startGame">
    start
  </div>
  <div id="playground"></div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-var-requires */
import Game from '@/snake/Game';
import Map from '@/snake/Map';
import Foods from '@/snake/Food';
import Snake, { DIRECTION } from '@/snake/Snake';
import { onMounted } from 'vue';

let timer = 0;
let render = () => { /* */ }

const startGame = () => {
  clearInterval(timer);
  if (!render) return;
  timer = setInterval(() => {
    render();
  }, 500);
}

onMounted(async () => {
  const game = new Game('#playground');
  await game.texture.createTexture('logo', require('./assets/logo.png'));
  await game.texture.createTexture('food1', require('./assets/food_1.png'));
  await game.texture.createTexture('food2', require('./assets/food_2.png'));
  await game.texture.createTexture('food3', require('./assets/food_3.png'));
  await game.texture.createTexture('food4', require('./assets/food_4.png'));
  game.init();
  const map = new Map(game);
  map.registerListeners((event) => {
    const { code } = event;
    switch(code) {
      case 'ArrowUp':
        snake.changeDirection(DIRECTION.UP);
        break;
      case 'ArrowRight':
        snake.changeDirection(DIRECTION.RIGHT);
        break;
      case 'ArrowLeft':
        snake.changeDirection(DIRECTION.LEFT);
        break;
      case 'ArrowDown':
        snake.changeDirection(DIRECTION.DOWN);
        break;
    }
  })
  const foods = new Foods(game, map);
  const snake = new Snake(game, map, foods);
  snake.onGameOver = () => {
    alert('game over!!')
    clearInterval(timer);
  }
  game.addItem(map);
  game.addItem(snake);
  game.addItem(foods);
  game.render();
  render = () => {
    snake.move();
    foods.createFood();
    game.render();
  }
})
</script>

<style type="scss" scoped>

#playground {
  width: 500px;
  height: 500px;
  margin: 50px auto;
}

.btn {
  padding: 10px;
  border: solid 1px lightgray;
  width: fit-content;
  margin: 50px auto auto;
  cursor: pointer;
  &:hover {
    background: lightgray;
  }
}
</style>
