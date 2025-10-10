import * as THREE from 'three';

/**
 * Configuration options for the particle system
 */
export interface ParticleConfig {
  /** Number of particles to emit per frame */
  emissionRate: number;
  /** How long particles live (in seconds) */
  particleLifetime: number;
  /** Whether particle brightness depends on cursor speed */
  speedBasedBrightness: boolean;
  /** Multiplier for speed-based brightness effect */
  brightnessMultiplier: number;
  /** Minimum brightness when speed is zero */
  minBrightness: number;
  /** Base size of particles */
  particleSize: number;
  /** How much cursor speed affects particle velocity */
  velocitySpread: number;
  /** Air resistance/drag coefficient */
  drag: number;
}

/**
 * Options for creating a cursor trail effect
 */
export interface CursorTrailOptions {
  /** HTML element to attach the effect to */
  container?: HTMLElement | string;
  /** Maximum number of particles */
  maxParticles?: number;
  /** Initial particle configuration */
  config?: Partial<ParticleConfig>;
  /** Whether to show debug GUI */
  showGUI?: boolean;
  /** Custom Three.js camera */
  camera?: THREE.Camera;
  /** Custom Three.js renderer */
  renderer?: THREE.WebGLRenderer;
  /** Custom particle colors */
  colors?: string[];
  /** Enable anti-aliasing */
  antialias?: boolean;
  /** Pixel ratio override */
  pixelRatio?: number;
}

/**
 * Events emitted by the particle system
 */
export interface ParticleSystemEvents {
  /** Fired when a particle is created */
  particleCreated: { position: THREE.Vector3; velocity: THREE.Vector3 };
  /** Fired when a particle dies */
  particleDied: { position: THREE.Vector3; lifetime: number };
  /** Fired when particle count changes */
  countChanged: { activeCount: number; maxCount: number };
}

/**
 * Particle data structure
 */
export interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  active: boolean;
}

/**
 * Cursor position and velocity data
 */
export interface CursorData {
  position: { x: number; y: number };
  velocity: number;
  normalizedVelocity: number;
}

/**
 * Trail effect configuration
 */
export interface TrailConfig {
  /** Trail fade speed */
  fadeSpeed: number;
  /** Trail blur amount */
  blur: number;
  /** Trail color tint */
  tint: THREE.Color;
}

/**
 * Supported WebGL blend modes
 */
export type BlendMode = 
  | 'normal'
  | 'additive'
  | 'multiply'
  | 'screen'
  | 'overlay';

/**
 * Color scheme presets
 */
export type ColorScheme = 
  | 'blue'
  | 'rainbow'
  | 'fire'
  | 'ice'
  | 'matrix'
  | 'custom';