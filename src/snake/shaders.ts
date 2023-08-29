export const pointVertSrc = `
  attribute vec2 a_position;
  attribute vec4 a_color;
  attribute float a_size;
  varying vec4 v_color;
  uniform mat4 u_projection;
  void main(void) {
    gl_Position = u_projection * vec4(a_position, 0, 1.0);
    gl_PointSize = 1.0 * a_size;
    v_color = a_color;
  }
`;

export const pointFrgSrc = `
  precision mediump float;
  varying vec4 v_color;

  void main() {
    gl_FragColor = v_color;
  }
`;

export const textureVertSrc = `
  attribute vec2 a_position;
  attribute float a_textureIndex;
  varying float v_textureIndex;
  attribute vec2 a_texCoord;
  varying vec2 v_texCoord;
  uniform mat4 u_projection;
  void main() {
    gl_Position = u_projection * vec4(a_position, 0, 1.0);
    v_textureIndex = a_textureIndex;
    v_texCoord = a_texCoord; 
  }
`;

export const textureFrgSrc = `
  #define numTextures 8
  precision mediump float;
  varying float v_textureIndex;
  varying vec2 v_texCoord;
  uniform sampler2D u_textures[numTextures];
      
  vec4 getSampleFromArray(sampler2D textures[8], int ndx, vec2 uv) {
    vec4 color = vec4(uv, 0, 1);
    for (int i = 0; i < numTextures; ++i) {
      if (i == ndx) {
        color = texture2D(u_textures[i], uv);
      }
    }
    return color;
  }
      
  void main() {
    gl_FragColor = getSampleFromArray(u_textures, int(v_textureIndex + 0.5), v_texCoord);
  }
`;
