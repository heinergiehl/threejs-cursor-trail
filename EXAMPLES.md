# Usage Examples

## Basic Usage

### Starting the Application

```typescript
// src/main.ts
import { Application } from "./Application";

// Create and start the application
const app = new Application();
```

That's it! The application will automatically:

- Initialize Three.js scene
- Set up particle system
- Create trail effects
- Handle cursor tracking
- Start animation loop

## Customization Examples

### 1. Change Particle Count

```typescript
// src/Application.ts
private init(): void {
  // Change from default 5000 to 10000 particles
  this.particleSystem = new ParticleSystem(this.camera, 10000);
  this.scene.add(this.particleSystem.getMesh());
}
```

### 2. Adjust Emission Rate

```typescript
// Emit more particles per frame
this.particleSystem.setEmissionRate(15); // Default is 5

// Emit fewer particles (subtle effect)
this.particleSystem.setEmissionRate(2);
```

### 3. Modify Particle Behavior

Edit `src/core/ParticleSystem.ts`:

```typescript
private emitParticle(position: THREE.Vector3): void {
  const particle = this.particlePool.find(p => !p.active);
  if (!particle) return;

  particle.active = true;
  particle.lifetime = 0;
  particle.position.copy(position);

  // CUSTOMIZATION: Change particle spread
  particle.position.x += (Math.random() - 0.5) * 0.2; // Increase spread
  particle.position.y += (Math.random() - 0.5) * 0.2;

  // CUSTOMIZATION: Change velocity
  const angle = Math.random() * Math.PI * 2;
  const speed = Math.random() * 0.05 + 0.02; // Faster particles
  particle.velocity.set(
    Math.cos(angle) * speed,
    Math.sin(angle) * speed,
    (Math.random() - 0.5) * 0.02
  );
}
```

### 4. Change Particle Colors

Edit `src/shaders/particle.vert.glsl`:

```glsl
void main() {
  // ... existing code ...

  // CUSTOMIZATION: Change color scheme
  vColor = vec3(
    1.0,                          // Red channel (0.0 to 1.0)
    0.3 + aRandomness.y * 0.3,   // Green channel
    0.5 + aRandomness.x * 0.5    // Blue channel
  );
  // This creates a red-orange-pink palette
}
```

Examples:

```glsl
// Pure cyan (original)
vColor = vec3(0.0, 0.5 + aRandomness.y * 0.5, 1.0);

// Purple
vColor = vec3(0.8, 0.2, 1.0);

// Green
vColor = vec3(0.2, 1.0, 0.3);

// Rainbow (based on position)
vColor = vec3(
  0.5 + 0.5 * sin(position.x * 5.0),
  0.5 + 0.5 * sin(position.y * 5.0 + 2.0),
  0.5 + 0.5 * sin(position.z * 5.0 + 4.0)
);
```

### 5. Adjust Particle Lifetime

```typescript
// src/core/ParticleSystem.ts
public update(deltaTime: number): void {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    const particle = this.particles[i];

    // CUSTOMIZATION: Slower fade (longer lifetime)
    particle.lifetime += deltaTime * 0.3; // Default is 0.5

    // Or faster fade (shorter lifetime)
    particle.lifetime += deltaTime * 0.8;
  }
}
```

### 6. Add Gravity Effect

```typescript
// src/core/ParticleSystem.ts
public update(deltaTime: number): void {
  for (let i = this.particles.length - 1; i >= 0; i--) {
    const particle = this.particles[i];

    particle.position.add(particle.velocity);

    // CUSTOMIZATION: Adjust gravity strength
    particle.velocity.y -= 0.001; // Fall down
    // particle.velocity.y += 0.001; // Float up

    // Add drag (air resistance)
    particle.velocity.multiplyScalar(0.98);
  }
}
```

### 7. Change Cursor Style

Edit `src/style.css`:

```css
.cursor {
  width: 30px; /* Larger cursor */
  height: 30px;
  border: 3px solid rgba(255, 100, 200, 0.9); /* Pink */
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 30px rgba(255, 100, 200, 0.8);

  /* Add background */
  background: rgba(255, 100, 200, 0.1);
}

/* Animated cursor */
.cursor {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
```

### 8. Change Trail Effect

Edit `src/shaders/trail.frag.glsl`:

```glsl
void main() {
  vec4 color = texture2D(uTexture, vUv);

  // CUSTOMIZATION: Faster decay (shorter trail)
  color *= 0.90; // Default is 0.96

  // CUSTOMIZATION: Slower decay (longer trail)
  // color *= 0.99;

  // CUSTOMIZATION: Change trail color
  vec3 particleColor = vec3(1.0, 0.3, 0.5); // Pink trail

  // CUSTOMIZATION: Larger trail radius
  float radius = 50.0; // Default is 30.0

  float dist = distance(pixelPos, uMouse);
  float intensity = smoothstep(radius, 0.0, dist);

  color.rgb += particleColor * intensity * 0.6;
  gl_FragColor = vec4(color.rgb, 1.0);
}
```

### 9. Camera Movement

```typescript
// src/Application.ts
private animate(): void {
  requestAnimationFrame(() => this.animate());

  const elapsedTime = this.clock.getElapsedTime();

  // CUSTOMIZATION: Rotate camera
  this.camera.position.x = Math.sin(elapsedTime * 0.2) * 0.5;
  this.camera.position.y = Math.cos(elapsedTime * 0.2) * 0.5;
  this.camera.lookAt(0, 0, 0);

  // ... rest of animation code
}
```

### 10. Particle Size Adjustment

Edit `src/shaders/particle.vert.glsl`:

```glsl
void main() {
  // ... existing code ...

  // CUSTOMIZATION: Base size
  float baseSize = 3.0; // Default is 2.0 (larger particles)

  // CUSTOMIZATION: Animation range
  float sizeAnimation = sin((uTime + aDelay) * 3.0) * 0.5 + 0.5;
  gl_PointSize = aScale * uPixelRatio * (baseSize + sizeAnimation * 4.0);

  // CUSTOMIZATION: Disable size animation
  // gl_PointSize = aScale * uPixelRatio * baseSize;

  gl_PointSize *= (300.0 / -viewPosition.z);
}
```

## Advanced Examples

### 11. Multiple Particle Systems

```typescript
// src/Application.ts
export class Application {
  private particleSystem1!: ParticleSystem;
  private particleSystem2!: ParticleSystem;

  private init(): void {
    // System 1: Fast, small particles
    this.particleSystem1 = new ParticleSystem(this.camera, 3000);
    this.particleSystem1.setEmissionRate(10);
    this.scene.add(this.particleSystem1.getMesh());

    // System 2: Slow, large particles
    this.particleSystem2 = new ParticleSystem(this.camera, 1000);
    this.particleSystem2.setEmissionRate(2);
    this.scene.add(this.particleSystem2.getMesh());
  }

  private animate(): void {
    // Update both systems
    this.particleSystem1.update(deltaTime);
    this.particleSystem2.update(deltaTime);

    // Emit from both
    this.particleSystem1.emitParticles(cursorPos.x, cursorPos.y, w, h);
    this.particleSystem2.emitParticles(cursorPos.x, cursorPos.y, w, h);
  }
}
```

### 12. Emit Particles on Click

```typescript
// src/core/Cursor.ts
export class Cursor {
  private onClickCallback?: (x: number, y: number) => void;

  constructor(onClickCallback?: (x: number, y: number) => void) {
    this.onClickCallback = onClickCallback;
    this.element = document.createElement('div');
    this.element.className = 'cursor';
    document.body.appendChild(this.element);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
    document.addEventListener('click', this.onClick.bind(this));
  }

  private onClick(event: MouseEvent): void {
    if (this.onClickCallback) {
      this.onClickCallback(event.clientX, event.clientY);
    }
  }
}

// src/Application.ts
private init(): void {
  this.cursor = new Cursor((x, y) => {
    // Emit burst of particles on click
    const savedRate = this.particleSystem.setEmissionRate(50);
    this.particleSystem.emitParticles(x, y, window.innerWidth, window.innerHeight);
    setTimeout(() => this.particleSystem.setEmissionRate(5), 100);
  });
}
```

### 13. Performance Monitoring

```typescript
// Install: npm install stats.js @types/stats.js

import Stats from "stats.js";

export class Application {
  private stats: Stats;

  private init(): void {
    // Add FPS monitor
    this.stats = new Stats();
    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
    document.body.appendChild(this.stats.dom);
  }

  private animate(): void {
    this.stats.begin();

    // ... animation code ...

    this.stats.end();
    requestAnimationFrame(() => this.animate());
  }
}
```

### 14. Mobile Touch Support

```typescript
// src/core/Cursor.ts
private setupEventListeners(): void {
  document.addEventListener('mousemove', this.onMouseMove.bind(this));

  // Add touch support
  document.addEventListener('touchstart', this.onTouchStart.bind(this));
  document.addEventListener('touchmove', this.onTouchMove.bind(this));
}

private onTouchStart(event: TouchEvent): void {
  event.preventDefault();
  const touch = event.touches[0];
  this.updatePosition(touch.clientX, touch.clientY);
}

private onTouchMove(event: TouchEvent): void {
  event.preventDefault();
  const touch = event.touches[0];
  this.updatePosition(touch.clientX, touch.clientY);
}

private updatePosition(x: number, y: number): void {
  this.targetX = x;
  this.targetY = y;

  gsap.to(this.element, {
    x: x - 10,
    y: y - 10,
    duration: 0.3,
    ease: 'power2.out'
  });
}

private onMouseMove(event: MouseEvent): void {
  this.updatePosition(event.clientX, event.clientY);
}
```

### 15. Particle Collision Detection

```typescript
// src/core/ParticleSystem.ts
public update(deltaTime: number): void {
  const positions = this.geometry.attributes.position.array as Float32Array;

  for (let i = this.particles.length - 1; i >= 0; i--) {
    const particle = this.particles[i];

    // Update position
    particle.position.add(particle.velocity);

    // CUSTOMIZATION: Bounce off edges
    if (particle.position.x > 2 || particle.position.x < -2) {
      particle.velocity.x *= -0.8; // Bounce with energy loss
    }
    if (particle.position.y > 1.5 || particle.position.y < -1.5) {
      particle.velocity.y *= -0.8;
    }

    // ... rest of update code
  }
}
```

## Configuration Object Pattern

For easier customization, create a config file:

```typescript
// src/config.ts
export const ParticleConfig = {
  maxParticles: 5000,
  emissionRate: 5,
  particleLifetime: 2.0,
  gravity: 0.0005,
  drag: 0.98,
  spread: 0.1,
  colors: {
    r: 0.0,
    g: 0.6,
    b: 1.0
  },
  trail: {
    decay: 0.96,
    radius: 30,
    intensity: 0.6
  }
};

// Use in ParticleSystem
import { ParticleConfig } from '../config';

constructor(camera: THREE.Camera, maxParticles: number = ParticleConfig.maxParticles) {
  // ...
  this.emissionRate = ParticleConfig.emissionRate;
}
```

## Tips

1. **Testing changes**: With Vite's HMR, changes appear instantly
2. **Performance**: Use browser DevTools Performance tab to profile
3. **Debugging shaders**: Check console for WebGL errors
4. **Particle count**: Start small and increase gradually
5. **Colors**: Use HSL for easier color manipulation

## Common Issues

### Too slow?

- Reduce `maxParticles`
- Lower `emissionRate`
- Disable trail effect temporarily

### Particles not visible?

- Check camera position and direction
- Verify particle emission in update loop
- Check shader uniforms

### Trail not showing?

- Ensure FBO is rendering before particles
- Check trail decay rate (should be < 1.0)
- Verify mouse position is being updated

## Next Steps

- Add particle textures (sprites)
- Implement particle physics
- Create particle presets
- Add audio reactivity
- Build particle editor UI
