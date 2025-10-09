import * as THREE from 'three';
import particleVertexShader from '../shaders/particle.vert.glsl?raw';
import particleFragmentShader from '../shaders/particle.frag.glsl?raw';

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  lifetime: number;
  active: boolean;
}

export class ParticleSystem {
  private geometry: THREE.BufferGeometry;
  private material: THREE.ShaderMaterial;
  private points: THREE.Points;
  private particles: Particle[] = [];
  private maxParticles: number;
  private particlePool: Particle[] = [];
  private camera: THREE.Camera;
  
  // Configuration parameters
  public config = {
    emissionRate: 15,
    particleLifetime: 2.5,
    speedBasedBrightness: true,
    brightnessMultiplier: 2.0,
    minBrightness: 0.2,
    particleSize: 1.0,
    velocitySpread: 1.0,
    drag: 0.97
  };

  constructor(camera: THREE.Camera, maxParticles: number = 5000) {
    this.camera = camera;
    this.maxParticles = maxParticles;
    
    // Initialize particle pool
    for (let i = 0; i < maxParticles; i++) {
      this.particlePool.push({
        position: new THREE.Vector3(),
        velocity: new THREE.Vector3(),
        lifetime: 0,
        active: false
      });
    }

    this.geometry = this.createGeometry();
    this.material = this.createMaterial();
    this.points = new THREE.Points(this.geometry, this.material);
  }

  private createGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(this.maxParticles * 3);
    const scales = new Float32Array(this.maxParticles);
    const randomness = new Float32Array(this.maxParticles * 3);
    const delays = new Float32Array(this.maxParticles);
    const lifetimes = new Float32Array(this.maxParticles);

    for (let i = 0; i < this.maxParticles; i++) {
      positions[i * 3] = 0;
      positions[i * 3 + 1] = 0;
      positions[i * 3 + 2] = 0;
      
      scales[i] = Math.random() * 0.3 + 0.2;
      randomness[i * 3] = Math.random();
      randomness[i * 3 + 1] = Math.random();
      randomness[i * 3 + 2] = Math.random();
      delays[i] = Math.random() * Math.PI * 2;
      lifetimes[i] = 1.0; // Start invisible
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
    geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
    geometry.setAttribute('aLifetime', new THREE.BufferAttribute(lifetimes, 1));

    return geometry;
  }

  private createMaterial(): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSpeedBrightness: { value: 1.0 },
        uBrightnessMultiplier: { value: this.config.brightnessMultiplier },
        uMinBrightness: { value: this.config.minBrightness },
        uParticleSize: { value: this.config.particleSize }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
  }

  /**
   * Emit particles at the cursor position in screen space
   */
  public emitParticles(screenX: number, screenY: number, width: number, height: number, velocity: number = 0): void {
    // Convert screen coordinates to normalized device coordinates
    const ndcX = (screenX / width) * 2 - 1;
    const ndcY = -(screenY / height) * 2 + 1;

    // Create a vector in NDC space
    const ndc = new THREE.Vector3(ndcX, ndcY, 0.5);
    
    // Unproject to world space
    ndc.unproject(this.camera);
    
    // Get direction from camera to the unprojected point
    const direction = ndc.sub(this.camera.position).normalize();
    
    // Place particles at a fixed distance from camera
    const distance = 3;
    const worldPos = this.camera.position.clone().add(direction.multiplyScalar(distance));

    // Update speed-based brightness uniform
    if (this.config.speedBasedBrightness) {
      this.material.uniforms.uSpeedBrightness.value = Math.max(this.config.minBrightness, velocity * this.config.brightnessMultiplier);
    } else {
      this.material.uniforms.uSpeedBrightness.value = 1.0;
    }

    // Emit multiple particles
    for (let i = 0; i < this.config.emissionRate; i++) {
      this.emitParticle(worldPos, velocity);
    }
  }

  private emitParticle(position: THREE.Vector3, velocity: number = 0): void {
    // Find inactive particle
    const particle = this.particlePool.find(p => !p.active);
    if (!particle) return;

    particle.active = true;
    particle.lifetime = 0;
    
    // Set position with slight random offset
    particle.position.copy(position);
    particle.position.x += (Math.random() - 0.5) * 0.02;
    particle.position.y += (Math.random() - 0.5) * 0.02;
    particle.position.z += (Math.random() - 0.5) * 0.02;
    
    // Set velocity with random direction (more natural spread)
    const angle = Math.random() * Math.PI * 2;
    const baseSpeed = Math.random() * 0.015 + 0.005;
    const speedMultiplier = this.config.speedBasedBrightness ? (1 + velocity * this.config.velocitySpread) : 1;
    const speed = baseSpeed * speedMultiplier;
    const verticalBias = (Math.random() - 0.5) * 0.01; // Random up/down
    particle.velocity.set(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed + verticalBias,
      (Math.random() - 0.5) * 0.01
    );

    this.particles.push(particle);
  }

  public update(deltaTime: number): void {
    const positions = this.geometry.attributes.position.array as Float32Array;
    const lifetimes = this.geometry.attributes.aLifetime.array as Float32Array;

    // Update active particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      
      if (!particle.active) {
        this.particles.splice(i, 1);
        continue;
      }

      // Update lifetime
      particle.lifetime += deltaTime * (1 / this.config.particleLifetime);
      
      // Deactivate if lifetime exceeded
      if (particle.lifetime >= 1.0) {
        particle.active = false;
        this.particles.splice(i, 1);
        continue;
      }

      // Update position
      particle.position.add(particle.velocity);
      
      // Apply drag (air resistance)
      particle.velocity.multiplyScalar(this.config.drag);
      
      // Slight random turbulence
      particle.velocity.x += (Math.random() - 0.5) * 0.0001;
      particle.velocity.y += (Math.random() - 0.5) * 0.0001;
      
      // Update geometry
      const index = this.particlePool.indexOf(particle);
      if (index !== -1) {
        positions[index * 3] = particle.position.x;
        positions[index * 3 + 1] = particle.position.y;
        positions[index * 3 + 2] = particle.position.z;
        lifetimes[index] = particle.lifetime;
      }
    }

    // Mark attributes as needing update
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.aLifetime.needsUpdate = true;
  }

  public updateTime(time: number): void {
    this.material.uniforms.uTime.value = time;
  }

  public getMesh(): THREE.Points {
    return this.points;
  }

  public setEmissionRate(rate: number): void {
    this.config.emissionRate = Math.max(1, Math.min(50, rate));
  }

  public updateUniforms(): void {
    this.material.uniforms.uBrightnessMultiplier.value = this.config.brightnessMultiplier;
    this.material.uniforms.uMinBrightness.value = this.config.minBrightness;
    this.material.uniforms.uParticleSize.value = this.config.particleSize;
  }

  public dispose(): void {
    this.geometry.dispose();
    this.material.dispose();
  }
}
