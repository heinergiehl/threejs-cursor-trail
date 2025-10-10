// Core exports
export { ParticleSystem } from './core/ParticleSystem';
export { TrailEffect } from './core/TrailEffect';
export { Cursor } from './core/Cursor';

// Main application class
export { Application } from './Application';

// Types
export type { 
  ParticleConfig,
  CursorTrailOptions,
  ParticleSystemEvents
} from './types';

// Utilities
export { 
  createParticleSystem,
  createCursorTrail,
  getDefaultConfig
} from './utils';

// Constants
export { 
  DEFAULT_PARTICLE_COUNT,
  DEFAULT_EMISSION_RATE,
  SUPPORTED_BLEND_MODES
} from './constants';

// Version
export const VERSION = '1.0.0';