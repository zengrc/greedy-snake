<template>
  <div id="playground"></div>
</template>

<script lang="ts" setup>
/* eslint-disable @typescript-eslint/no-var-requires */
import Game from '@/snake/Game';
import Map from '@/snake/Map';
import Foods from '@/snake/Food';
import Snake, { DIRECTION } from '@/snake/Snake';
import { onMounted } from 'vue';

onMounted(async () => {
  const game = new Game('#playground');
  await game.texture.createTexture('logo', require('./assets/logo.png'));
  let timer = 0;
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
  // timer = setInterval(() => {
  //   snake.move();
  //   foods.createFood();
  //   game.render();
  // }, 500);
})
</script>

<style type="scss" scoped>

#playground {
  width: 500px;
  height: 500px;
  margin: 50px auto;
}
</style>
