import * as THREE from 'three';

/**
 * Default particle count for new systems
 */
export const DEFAULT_PARTICLE_COUNT = 5000;

/**
 * Default emission rate (particles per frame)
 */
export const DEFAULT_EMISSION_RATE = 15;

/**
 * Supported WebGL blend modes
 */
export const SUPPORTED_BLEND_MODES = [
  'normal',
  'additive',
  'multiply',
  'screen',
  'overlay'
] as const;

/**
 * Default particle configuration
 */
export const DEFAULT_PARTICLE_CONFIG = {
  emissionRate: 15,
  particleLifetime: 2.5,
  speedBasedBrightness: true,
  brightnessMultiplier: 2.0,
  minBrightness: 0.2,
  particleSize: 1.0,
  velocitySpread: 1.0,
  drag: 0.97
};

/**
 * Color scheme definitions
 */
export const COLOR_SCHEMES = {
  blue: ['#0080ff', '#00a0ff', '#0060ff'],
  rainbow: ['#ff0080', '#ff8000', '#80ff00', '#00ff80', '#0080ff', '#8000ff'],
  fire: ['#ff4000', '#ff8000', '#ffff00', '#ff6000'],
  ice: ['#00ffff', '#80ffff', '#a0f0ff', '#c0f8ff'],
  matrix: ['#00ff00', '#40ff40', '#80ff80']
} as const;

/**
 * Performance presets
 */
export const PERFORMANCE_PRESETS = {
  low: {
    maxParticles: 1000,
    emissionRate: 5,
    pixelRatio: 1
  },
  medium: {
    maxParticles: 3000,
    emissionRate: 10,
    pixelRatio: Math.min(window.devicePixelRatio, 1.5)
  },
  high: {
    maxParticles: 5000,
    emissionRate: 15,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  },
  ultra: {
    maxParticles: 10000,
    emissionRate: 25,
    pixelRatio: window.devicePixelRatio
  }
} as const;

/**
 * Three.js blend mode mappings
 */
export const BLEND_MODE_MAP = {
  normal: THREE.NormalBlending,
  additive: THREE.AdditiveBlending,
  multiply: THREE.MultiplyBlending,
  screen: THREE.CustomBlending,
  overlay: THREE.CustomBlending
} as const;