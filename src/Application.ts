import * as THREE from 'three';
import { ParticleSystem } from './core/ParticleSystem';
import { TrailEffect } from './core/TrailEffect';
import { Cursor } from './core/Cursor';

export class Application {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private particleSystem!: ParticleSystem;
  private trailEffect!: TrailEffect;
  private cursor!: Cursor;
  private displayCamera!: THREE.OrthographicCamera;
  private clock: THREE.Clock;
  private lastTime: number = 0;

  constructor() {
    this.clock = new THREE.Clock();
    this.init();
    this.setupEventListeners();
    this.animate();
  }

  private init(): void {
    // Setup main scene
    this.scene = new THREE.Scene();
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 3;

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    document.body.appendChild(this.renderer.domElement);

    // Setup display camera for FBO
    this.displayCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);

    // Initialize systems
    this.particleSystem = new ParticleSystem(this.camera, 5000);
    this.scene.add(this.particleSystem.getMesh());

    this.trailEffect = new TrailEffect(window.innerWidth, window.innerHeight);
    
    this.cursor = new Cursor();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private onResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.trailEffect.resize(window.innerWidth, window.innerHeight);
  }

  private animate(): void {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();
    const deltaTime = elapsedTime - this.lastTime;
    this.lastTime = elapsedTime;

    // Update cursor
    this.cursor.update();
    const cursorPos = this.cursor.getPosition();

    // Emit particles at cursor position
    this.particleSystem.emitParticles(
      cursorPos.x,
      cursorPos.y,
      window.innerWidth,
      window.innerHeight
    );

    // Update particle system
    this.particleSystem.update(deltaTime);
    this.particleSystem.updateTime(elapsedTime);

    // Update trail effect
    this.trailEffect.update(
      this.renderer,
      cursorPos.x,
      window.innerHeight - cursorPos.y,
      elapsedTime
    );

    // Render
    this.render();
  }

  private render(): void {
    // Clear
    this.renderer.setRenderTarget(null);
    this.renderer.clear();

    // Render trail effect first
    this.trailEffect.render(this.renderer, this.displayCamera);

    // Then render particles on top
    this.renderer.render(this.scene, this.camera);
  }

  public dispose(): void {
    this.particleSystem.dispose();
    this.trailEffect.dispose();
    this.cursor.dispose();
    this.renderer.dispose();
  }
}
