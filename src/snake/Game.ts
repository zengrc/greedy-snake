/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { pointVertSrc, pointFrgSrc, textureFrgSrc, textureVertSrc } from './shaders';
import { createProgram, createShader, createProjectionMat, setUniformMat, setAttribute } from './utils'
import Texture from './Texture';

export class GameItem {
  private type: 'point' | 'cube'
  x: number
  y: number
  width: number
  height: number
  texture?: string
  rotate?: number
  scale = 1
  translateX = 0
  translateY = 0
  red = 0.5
  blue = 0.5
  green = 0.5
  alpha = 1

  constructor(type: 'point' | 'cube', x = 0, y = 0, width = 0, height = 0) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  isPoint() {
    return this.type === 'point';
  }

  isTexture() {
    return this.type === 'cube' && !!this.texture;
  }
}

export abstract class GameObject {
  abstract items: GameItem[]
}

export default class Game {
  canvas: HTMLCanvasElement
  width = 0
  height = 0
  container: HTMLElement | null = null
  gl: WebGLRenderingContext | null = null
  gameObjects: GameObject[] = []
  pointProgram: WebGLProgram | null = null
  textureProgram: WebGLProgram | null = null
  projectionMat: number[] = [];
  texture: Texture;

  constructor(root: HTMLElement | string) {
    if (typeof root === 'string') {
      this.container = document.querySelector(root);
    } else {
      this.container = root;
    }

    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl');
    this.texture = new Texture(this.gl);

    if (!this.gl) return;

    if (this.container) {
      this.container.appendChild(this.canvas);
      this.canvas.width = this.container.clientWidth;
      this.canvas.height = this.container.clientHeight;
      this.canvas.style.width = '100%';
      this.canvas.style.height = '100%';
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.projectionMat = createProjectionMat(0, this.canvas.width, 0, this.canvas.height);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private clearCanvas() {
    if (!this.gl) return;
    this.gl.clearColor(0, 0, 0, 1);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  }

  private switchPointProgram() {
    if (!this.gl) return;
    if (!this.pointProgram) {
      const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, pointVertSrc);
      const frgShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, pointFrgSrc);
      if (!vertexShader || !frgShader) return;
      this.pointProgram = createProgram(this.gl, [vertexShader, frgShader]);
      if (!this.pointProgram) return;
      setUniformMat(this.gl, this.pointProgram, this.projectionMat, 'u_projection');
    }
    if (!this.pointProgram) return;
    this.gl.useProgram(this.pointProgram);
  }

  private switchTextureProgram() {
    if (!this.gl) return;
    if (!this.textureProgram) {
      const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, textureVertSrc);
      const frgShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, textureFrgSrc);
      if (!vertexShader || !frgShader) return;
      this.textureProgram = createProgram(this.gl, [vertexShader, frgShader]);
      if (!this.textureProgram) return;
      setUniformMat(this.gl, this.textureProgram, this.projectionMat, 'u_projection');
      const textureLoc = this.gl.getUniformLocation(this.textureProgram, "u_textures");
      this.gl.uniform1iv(textureLoc, [0, 1, 2, 3]);
    }
    if (!this.textureProgram) return;
    this.gl.useProgram(this.textureProgram);
  }

  private getPos(item: GameItem) {
    if (item.isPoint()) {
      // point shader没有translate mat 直接反应在pos上
      return [item.x + item.translateX, item.y + item.translateY];
    } else if (item.isTexture()) {
      // 简单操作，理论上平移应该用矩阵实现
      const centerX = item.x + item.translateX;
      const centerY = item.y + item.translateY;
      const left = centerX - item.width / 2;
      const right = centerX + item.width / 2;
      const top = centerY - item.height / 2;
      const down = centerY + item.height / 2;
      return [
        left, top, right, top, left, down,
        left, down, right, down, right, top
      ];
    }
    return [item.x, item.y];
  }

  private drawPoints(points: GameItem[]) {
    if (!this.gl) return;
    this.switchPointProgram();
    if (!this.pointProgram) return;

    const pointPos: number[] = [];
    const pointColor: number[] = [];
    const pointSize: number[] = [];

    points.forEach(point => {
      pointPos.splice(pointPos.length, 0, ...this.getPos(point));
      pointColor.splice(pointColor.length, 0, point.red, point.green, point.blue, point.alpha);
      pointSize.push(point.scale);
    })

    setAttribute(this.gl!, this.pointProgram!, pointPos, 'a_position');
    setAttribute(this.gl!, this.pointProgram!, pointSize, 'a_size', 1);
    setAttribute(this.gl!, this.pointProgram!, pointColor, 'a_color', 4);

    this.gl.drawArrays(this.gl.POINTS, 0, points.length)
  }

  private drawTexture(cubes: GameItem[]) {
    if (!this.gl) return;
    this.switchTextureProgram();
    if (!this.textureProgram) return;

    const pointPos: number[] = [];
    const textureIdx: number[] = [];
    const coorPos: number[] = [];

    cubes.forEach(cube => {
      pointPos.splice(pointPos.length, 0, ...this.getPos(cube));
      // 两个三角形 六个点
      const textureConfig = this.texture.getTexture(cube.texture!);
      textureIdx.push(textureConfig.textureID);
      textureIdx.push(textureConfig.textureID);
      textureIdx.push(textureConfig.textureID);
      textureIdx.push(textureConfig.textureID);
      textureIdx.push(textureConfig.textureID);
      textureIdx.push(textureConfig.textureID);

      coorPos.splice(coorPos.length, 0, ...[0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0])
    })

    setAttribute(this.gl, this.textureProgram, pointPos, 'a_position');
    setAttribute(this.gl, this.textureProgram, textureIdx, 'a_textureIndex', 1, this.gl.STATIC_DRAW, true);
    setAttribute(this.gl, this.textureProgram, coorPos, 'a_texCoord');

    this.gl.drawArrays(this.gl.TRIANGLES, 0, cubes.length * 2 * 3);
  }

  init() {
    this.clearCanvas();
  }

  render() {
    this.clearCanvas();
    this.gameObjects.forEach(obj => {
      const pointArr: GameItem[] = [];
      const textureArr: GameItem[] = [];
      obj.items.forEach(i => {
        if (i.isPoint()) pointArr.push(i);
        else if (i.isTexture()) textureArr.push(i);
      });
      if (pointArr.length) this.drawPoints(pointArr);
      if (textureArr.length) this.drawTexture(textureArr);
    })
  }

  createPoint(x: number, y: number): GameItem {
    const item = new GameItem('point', x, y);
    return item;
  }

  addItem(item: GameObject | GameObject[]) {
    if (item instanceof Array) {
      item.forEach(i => this.gameObjects.push(i));
    } else {
      this.gameObjects.push(item);
    }
  }

  removeItem(item: GameObject | GameObject[]) {
    const newList: GameObject[] = [];
    const items = item instanceof Array ? item : [item];
    this.gameObjects.forEach(i => {
      const index = items.indexOf(i);
      if (index === -1) newList.push(i);
    })
    this.gameObjects = newList;
  }
}