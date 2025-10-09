# Particle Cursor Effect

A high-performance particle cursor effect built with Three.js and TypeScript, featuring thousands of particles with smooth trail effects.

## Features

- 🎨 **Optimized Particle System**: Efficiently handles 5000+ particles with object pooling
- 🎯 **Precise Cursor Tracking**: Particles emit exactly at cursor position
- ✨ **Trail Effects**: Beautiful FBO-based trail rendering
- 🚀 **TypeScript**: Fully typed with proper class architecture
- 📦 **Modular Design**: Separated concerns with clean class structure
- 🎭 **Custom Shaders**: GLSL shaders for advanced visual effects

## Project Structure

```
src/
├── core/
│   ├── ParticleSystem.ts   # Particle emission and management
│   ├── TrailEffect.ts      # FBO-based trail rendering
│   └── Cursor.ts           # Cursor tracking and rendering
├── shaders/
│   ├── particle.vert.glsl  # Particle vertex shader
│   ├── particle.frag.glsl  # Particle fragment shader
│   ├── trail.vert.glsl     # Trail vertex shader
│   ├── trail.frag.glsl     # Trail fragment shader
│   └── display.frag.glsl   # Display fragment shader
├── types/
│   └── shaders.d.ts        # TypeScript declarations for GLSL
├── Application.ts          # Main application orchestrator
├── main.ts                 # Entry point
└── style.css               # Styles
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## How It Works

### Particle System

- Uses object pooling to manage thousands of particles efficiently
- Emits particles at exact cursor position in world space
- Converts screen coordinates to 3D world coordinates using camera unprojection
- Each particle has lifetime, velocity, and position properties

### Trail Effect

- Uses Frame Buffer Objects (FBO) for efficient trail rendering
- Ping-pong rendering between two render targets
- Creates smooth decay effect with glow post-processing

### Cursor

- Custom cursor with GSAP animation
- Smooth interpolation for position tracking
- Provides both current and target positions for different use cases

## Performance

- Handles 5000+ particles at 60 FPS
- Efficient GPU-based rendering with custom shaders
- Object pooling prevents garbage collection overhead
- Optimized attribute updates only when necessary

## License

MIT
