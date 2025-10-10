# @heinergiehl/threejs-cursor-trail

[![NPM Version](https://img.shields.io/npm/v/@heinergiehl/threejs-cursor-trail.svg)](https://www.npmjs.com/package/@heinergiehl/threejs-cursor-trail)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/heinergiehl/threejs-cursor-trail/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/heinergiehl/threejs-cursor-trail/actions)

A high-performance, customizable 3D particle cursor trail effect built with Three.js and TypeScript. Create stunning interactive particle systems that respond to mouse movement with speed-based brightness, configurable physics, and smooth animations.

## ✨ Features

- 🚀 **High Performance** - Optimized WebGL rendering with efficient particle pooling
- ⚡ **Speed-Responsive** - Particles brightness/opacity adapts to cursor movement speed
- 🎨 **Highly Customizable** - Extensive configuration options for particles, physics, and visual effects
- 🎮 **Interactive GUI** - Real-time parameter adjustment with lil-gui integration
- 📱 **Mobile Friendly** - Responsive design with touch support and performance scaling
- 🌐 **Framework Agnostic** - Works with React, Vue, Angular, or vanilla JavaScript
- 📦 **TypeScript** - Full type definitions included
- 🔧 **Multiple Formats** - ESM, CommonJS, and UMD builds available

## 🚀 Quick Start

### Installation

```bash
npm install @heinergiehl/threejs-cursor-trail three
```

### Basic Usage

```javascript
import { createCursorTrail } from "@heinergiehl/threejs-cursor-trail";

// Create with default settings
const trail = createCursorTrail();

// Clean up when done
// trail.dispose();
```

### Custom Configuration

```javascript
import { createCursorTrail } from "@heinergiehl/threejs-cursor-trail";

const trail = createCursorTrail({
  maxParticles: 3000,
  config: {
    emissionRate: 20,
    particleLifetime: 3.0,
    speedBasedBrightness: true,
    brightnessMultiplier: 2.5,
    minBrightness: 0.3,
    particleSize: 1.2,
    velocitySpread: 1.5,
    drag: 0.95,
  },
  showGUI: true, // Enable debug controls
});
```

## 📖 API Reference

### Main Functions

#### `createCursorTrail(options?)`

Creates a complete cursor trail effect with automatic setup.

Made with ❤️ by [Heiner Giehl](https://github.com/heinergiehl)
