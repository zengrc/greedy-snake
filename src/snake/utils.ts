/* eslint-disable max-params */
export const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type);
  if (!shader) return;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('a error occured compiling shader', gl.getShaderInfoLog(shader));
    return;
  }

  return shader;
};

export const createProgram = (gl: WebGLRenderingContext, shaders: WebGLShader[]) => {
  const program = gl.createProgram();
  if (!program) return null;
  shaders.forEach((shader) => gl.attachShader(program, shader));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('a error occured linking program ', gl.getProgramInfoLog(program));
    return null;
  }

  gl.useProgram(program);
  return program;
};

export const setAttribute = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  data: number[],
  attribute: string,
  dataSize = 2,
  type?: number,
) => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), type || gl.STATIC_DRAW);
  // 获取顶点属性的在着色器中的索引，并激活它
  const aVertexPositionLocation = gl.getAttribLocation(program, attribute);
  gl.enableVertexAttribArray(aVertexPositionLocation);
  // 设置顶点属性如何从顶点缓冲对象中取值。每次从数组缓冲对象中读取2个值
  gl.vertexAttribPointer(aVertexPositionLocation, dataSize, gl.FLOAT, false, 0, 0);
};

export const setUniformMat = (
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  mat: number[],
  uniform: string,
) => {
  const uLocation = gl.getUniformLocation(program, uniform);
  gl.uniformMatrix4fv(uLocation, false, mat);
};

export const createProjectionMat = (left: number, right: number, top: number, bottom: number) => {
  // 坐标变换矩阵
  return [
    2 / (right - left),
    0,
    0,
    0,
    0,
    2 / (top - bottom),
    0,
    0,
    0,
    0,
    2,
    0,
    -(right + left) / (right - left),
    -(top + bottom) / (top - bottom),
    -1,
    1,
  ];
};

export const createScaleMat = (scale: number | number[]): number[] => {
  // 缩放矩阵
  if (typeof scale === 'object') {
    const [scaleX, scaleY] = scale;
    return [scaleX, 0, 0, 0, 0, scaleY, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
  return [scale, 0, 0, 0, 0, scale, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export const createRotateMat = (rotate: number) => {
  // 旋转矩阵
  rotate = (rotate * Math.PI) / 180;
  const cos = Math.cos(rotate);
  const sin = Math.sin(rotate);
  return [cos, sin, 0, 0, -sin, cos, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export const createTranslateMat = (tx: number, ty: number) => {
  // 平移矩阵
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1];
};
