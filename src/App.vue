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
import { onMounted } from 'vue';

enum GAME_STATUS {
  PENDING,
  GAME_OVER,
  PLAYING
}

let timer = 0;
let render = () => { /* */ }
let reset = () => { /* */ }
let gameStatus = GAME_STATUS.PENDING;

const TIME_GAP = 300;

const startGame = () => {
  if (gameStatus === GAME_STATUS.PENDING) {
    clearInterval(timer);
    if (!render) return;
    timer = setInterval(() => {
      render();
    }, TIME_GAP);
  } else if (gameStatus === GAME_STATUS.GAME_OVER) {
    reset();
    timer = setInterval(() => {
      render();
    }, TIME_GAP);
  }
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
  map.snake.onGameOver = () => {
    alert('game over!!')
    clearInterval(timer);
    gameStatus = GAME_STATUS.GAME_OVER;
  }
  game.add(map);
  game.render();
  render = () => {
    map.update();
    game.render();
  }
  reset = () => {
    map.reset();
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
