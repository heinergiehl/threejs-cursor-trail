# Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                            │
│                    (Entry Point)                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      main.ts                                 │
│                  (Bootstrap)                                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                   Application.ts                             │
│         (Main Orchestrator & Animation Loop)                 │
│                                                              │
│  • Initialize Three.js scene                                │
│  • Create camera and renderer                               │
│  • Coordinate all subsystems                                │
│  • Run animation loop                                       │
└───┬─────────────┬─────────────┬──────────────────────────┘
    │             │             │
    ▼             ▼             ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Particle │ │  Trail   │ │  Cursor  │
│  System  │ │  Effect  │ │          │
└──────────┘ └──────────┘ └──────────┘
```

## Component Hierarchy

```
Application
├── ParticleSystem
│   ├── THREE.BufferGeometry
│   │   ├── position attribute (Float32Array)
│   │   ├── aScale attribute
│   │   ├── aRandomness attribute
│   │   ├── aDelay attribute
│   │   └── aLifetime attribute
│   │
│   ├── THREE.ShaderMaterial
│   │   ├── Vertex Shader (particle.vert.glsl)
│   │   ├── Fragment Shader (particle.frag.glsl)
│   │   └── Uniforms (uTime, uPixelRatio)
│   │
│   └── Particle Pool (Object Pooling)
│       └── Array<Particle>
│           ├── position: Vector3
│           ├── velocity: Vector3
│           ├── lifetime: number
│           └── active: boolean
│
├── TrailEffect
│   ├── FBO Scene
│   │   ├── OrthographicCamera
│   │   └── Plane Mesh
│   │
│   ├── Render Targets (Ping-Pong)
│   │   ├── renderTargetA
│   │   └── renderTargetB
│   │
│   ├── Trail Material
│   │   ├── Vertex Shader (trail.vert.glsl)
│   │   ├── Fragment Shader (trail.frag.glsl)
│   │   └── Uniforms (uTexture, uMouse, uTime, uResolution)
│   │
│   └── Display Material
│       ├── Vertex Shader (trail.vert.glsl)
│       ├── Fragment Shader (display.frag.glsl)
│       └── Uniforms (uTexture, uTime)
│
└── Cursor
    ├── DOM Element (.cursor)
    ├── GSAP Animation
    └── Position Tracking
        ├── currentX/Y (smoothed)
        └── targetX/Y (actual mouse)
```

## Data Flow

```
User Mouse Movement
        │
        ▼
┌──────────────────┐
│  Cursor Class    │
│  • Track position│
│  • Smooth motion │
└────┬─────────────┘
     │
     ├──────────────────────────────┐
     │                              │
     ▼                              ▼
┌──────────────────┐        ┌──────────────────┐
│ ParticleSystem   │        │   TrailEffect    │
│                  │        │                  │
│ 1. Screen → NDC  │        │ 1. Update FBO    │
│ 2. NDC → World   │        │ 2. Render trail  │
│ 3. Emit particle │        │ 3. Apply glow    │
│ 4. Update pool   │        └──────────────────┘
└──────────────────┘
     │
     ▼
┌──────────────────┐
│  GPU Rendering   │
│                  │
│ • Vertex shader  │
│ • Fragment shader│
│ • Blending       │
└──────────────────┘
     │
     ▼
   Screen
```

## Particle Lifecycle

```
┌──────────────┐
│ Particle Pool│ (Pre-allocated)
│  [inactive]  │
└──────┬───────┘
       │
       │ emitParticle()
       ▼
┌──────────────┐
│   Active     │
│  • lifetime=0│
│  • position  │
│  • velocity  │
└──────┬───────┘
       │
       │ update() each frame
       │ • lifetime += delta
       │ • position += velocity
       │ • velocity += gravity
       ▼
┌──────────────┐
│  Rendering   │
│  • Update    │
│    attributes│
│  • Draw      │
└──────┬───────┘
       │
       │ lifetime >= 1.0
       ▼
┌──────────────┐
│ Deactivate & │
│ Return to    │
│ Pool         │
└──────────────┘
```

## Coordinate Transformation

```
Screen Space          NDC Space           World Space
(pixels)              (-1 to 1)           (3D units)

  ┌─────────┐
  │ (x, y)  │
  │ cursor  │
  └────┬────┘
       │
       │ normalize
       ▼
  ┌─────────┐
  │(-1 to 1)│
  │(-1 to 1)│
  └────┬────┘
       │
       │ unproject(camera)
       ▼
  ┌─────────┐         ┌──────────┐
  │ Vector3 │─────────│  Camera  │
  │ in 3D   │         │ Position │
  └────┬────┘         └──────────┘
       │                    │
       │ direction + distance
       ▼
  ┌─────────┐
  │ Particle│
  │ Position│
  └─────────┘
```

## Render Pipeline

```
┌────────────────────────────────────────────┐
│         Animation Loop (60 FPS)            │
└─┬──────────────────────────────────────────┘
  │
  ├─ 1. Update Cursor Position
  │     └─ Smooth interpolation
  │
  ├─ 2. Emit Particles
  │     ├─ Screen to world conversion
  │     └─ Add to active pool
  │
  ├─ 3. Update Particles
  │     ├─ Apply physics
  │     ├─ Update lifetime
  │     └─ Deactivate if needed
  │
  ├─ 4. Update Trail FBO
  │     ├─ Render to targetA
  │     ├─ Apply decay
  │     └─ Swap targets
  │
  ├─ 5. Render Trail
  │     ├─ Apply glow effect
  │     └─ Draw to screen
  │
  └─ 6. Render Particles
        ├─ Update uniforms
        ├─ Additive blending
        └─ Draw to screen
```

## Memory Management

```
┌─────────────────────────────────────┐
│          Object Pool                │
│  ┌─────────────────────────────┐   │
│  │ Allocated at startup        │   │
│  │ Size: 5000 particles        │   │
│  └─────────────────────────────┘   │
│                                     │
│  Active: [P1, P2, P3, ...]         │
│  Inactive: [P500, P501, ...]       │
│                                     │
│  Reuse instead of:                 │
│  ✗ new Particle()                  │
│  ✗ delete particle                 │
│  ✓ pool.find(p => !p.active)      │
└─────────────────────────────────────┘

Benefits:
• Zero garbage collection during runtime
• Predictable memory usage
• Consistent frame times
• Handles 1000s of particles smoothly
```

## Shader Pipeline

```
Vertex Shader (particle.vert.glsl)
          │
          ├─ Input: position, aScale, aRandomness, aDelay, aLifetime
          │
          ├─ Transform: modelMatrix × position
          │
          ├─ Calculate: gl_PointSize
          │
          ├─ Output: vColor, vAlpha
          │
          ▼
     Rasterization
          │
          ▼
Fragment Shader (particle.frag.glsl)
          │
          ├─ Input: vColor, vAlpha, gl_PointCoord
          │
          ├─ Calculate: circular shape
          │
          ├─ Apply: glow effect
          │
          ├─ Output: gl_FragColor
          │
          ▼
      Blending (Additive)
          │
          ▼
     Final Image
```

## File Dependencies

```
index.html
    └── main.ts
        └── Application.ts
            ├── ParticleSystem.ts
            │   ├── particle.vert.glsl
            │   └── particle.frag.glsl
            ├── TrailEffect.ts
            │   ├── trail.vert.glsl
            │   ├── trail.frag.glsl
            │   └── display.frag.glsl
            └── Cursor.ts
                └── style.css
```

## Build Process

```
Source Files (.ts, .glsl)
         │
         ▼
    TypeScript Compiler
         │
         ├─ Type checking
         ├─ Transpile to JS
         └─ Generate types
         │
         ▼
       Vite Bundler
         │
         ├─ Tree shaking
         ├─ Code splitting
         ├─ Minification
         └─ Asset optimization
         │
         ▼
   dist/bundle.js (Production)
```
