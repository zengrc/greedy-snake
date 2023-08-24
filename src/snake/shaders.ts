export const pointVertexSrc = `
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
