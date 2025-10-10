// Mock WebGL context for testing
const mockWebGL = {
  getParameter: jest.fn(() => 4096),
  createShader: jest.fn(() => ({})),
  shaderSource: jest.fn(),
  compileShader: jest.fn(),
  getShaderParameter: jest.fn(() => true),
  createProgram: jest.fn(() => ({})),
  attachShader: jest.fn(),
  linkProgram: jest.fn(),
  getProgramParameter: jest.fn(() => true),
  useProgram: jest.fn(),
  getUniformLocation: jest.fn(() => ({})),
  uniform1f: jest.fn(),
  uniform1i: jest.fn(),
  uniformMatrix4fv: jest.fn(),
  createBuffer: jest.fn(() => ({})),
  bindBuffer: jest.fn(),
  bufferData: jest.fn(),
  enableVertexAttribArray: jest.fn(),
  vertexAttribPointer: jest.fn(),
  drawArrays: jest.fn(),
  enable: jest.fn(),
  blendFunc: jest.fn(),
  clear: jest.fn(),
  clearColor: jest.fn(),
  viewport: jest.fn(),
  VERTEX_SHADER: 35633,
  FRAGMENT_SHADER: 35632,
  ARRAY_BUFFER: 34962,
  STATIC_DRAW: 35044,
  FLOAT: 5126,
  TRIANGLES: 4,
  BLEND: 3042,
  SRC_ALPHA: 770,
  ONE_MINUS_SRC_ALPHA: 771,
  COLOR_BUFFER_BIT: 16384,
  MAX_TEXTURE_SIZE: 3379,
  MAX_VERTEX_TEXTURE_IMAGE_UNITS: 35660
};

// Mock HTMLCanvasElement
Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  value: jest.fn(() => mockWebGL),
  writable: true,
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn();

// Mock performance.now
Object.defineProperty(window, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
  },
  writable: true,
});

// Mock devicePixelRatio
Object.defineProperty(window, 'devicePixelRatio', {
  value: 2,
  writable: true,
});

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};