/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { pointVertexSrc, pointFrgSrc } from './shaders';
import { createProgram, createShader, createProjectionMat, setUniformMat, setAttribute } from './utils'

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
  projectionMat: number[] = [];

  constructor(root: HTMLElement | string) {
    if (typeof root === 'string') {
      this.container = document.querySelector(root);
    } else {
      this.container = root;
    }

    this.canvas = document.createElement('canvas');
    this.gl = this.canvas.getContext('webgl');

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
      const vertexShader = createShader(this.gl, this.gl.VERTEX_SHADER, pointVertexSrc);
      const frgShader = createShader(this.gl, this.gl.FRAGMENT_SHADER, pointFrgSrc);
      if (!vertexShader || !frgShader) return;
      this.pointProgram = createProgram(this.gl, [vertexShader, frgShader]);
      if (!this.pointProgram) return;
      setUniformMat(this.gl, this.pointProgram, this.projectionMat, 'u_projection');
    }
    if (!this.pointProgram) return;
    this.gl.useProgram(this.pointProgram);
  }

  private getPos(item: GameItem) {
    if (item.isPoint()) {
      // point shader没有translate mat 直接反应在pos上
      return [item.x + item.translateX, item.y + item.translateY];
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

  init() {
    this.clearCanvas();
  }

  render() {
    this.clearCanvas();
    this.gameObjects.forEach(obj => {
      const pointArr: GameItem[] = [];
      obj.items.forEach(i => {
        if (i.isPoint()) pointArr.push(i);
      });
      this.drawPoints(pointArr);
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