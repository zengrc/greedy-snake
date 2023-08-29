export interface TextureConfig {
  link: string,
  img: HTMLImageElement,
  textureID: number,
  texture?: WebGLTexture | null
}

export default class Texture {
  private textureMap: Record<string, TextureConfig> = {}
  private gl: WebGLRenderingContext | null = null

  constructor(gl: WebGLRenderingContext | null) {
    this.gl = gl;
  }

  getTexture(name: string) {
    return this.textureMap[name];
  }

  generateWebglTexture(textureConfig: TextureConfig) {
    if (!this.gl) return null;
    this.gl.activeTexture(this.gl.TEXTURE0 + textureConfig.textureID);
    const texture = this.gl.createTexture();
    if (!texture) return null;
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, textureConfig.img);

    return texture;
  }

  createTexture(name: string, link: string) {
    if (this.textureMap[name]) return;
    this.textureMap[name] = {
      link,
      img: new Image(),
      textureID: Object.keys(this.textureMap).length
    }
    return new Promise(resolve => {
      this.textureMap[name].img.onload = () => {
        const texture = this.generateWebglTexture(this.textureMap[name]);
        this.textureMap[name].texture = texture;
        resolve(this.textureMap[name]);
      }
      this.textureMap[name].img.src = link;
    })
  }
}