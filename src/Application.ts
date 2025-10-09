import * as THREE from 'three';
import { GUI } from 'lil-gui';
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
  private gui!: GUI;

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
    
    // Setup GUI
    this.setupGUI();
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  private setupGUI(): void {
    this.gui = new GUI();
    this.gui.title('Particle System Controls');

    // Particle System folder
    const particlesFolder = this.gui.addFolder('Particles');
    
    particlesFolder.add(this.particleSystem.config, 'emissionRate', 1, 50, 1)
      .name('Emission Rate')
      .onChange((value: number) => {
        this.particleSystem.setEmissionRate(value);
      });
    
    particlesFolder.add(this.particleSystem.config, 'particleLifetime', 0.5, 5.0, 0.1)
      .name('Lifetime');
    
    particlesFolder.add(this.particleSystem.config, 'particleSize', 0.1, 3.0, 0.1)
      .name('Size')
      .onChange(() => {
        this.particleSystem.updateUniforms();
      });
    
    particlesFolder.add(this.particleSystem.config, 'velocitySpread', 0.0, 3.0, 0.1)
      .name('Velocity Spread');
    
    particlesFolder.add(this.particleSystem.config, 'drag', 0.90, 0.99, 0.001)
      .name('Drag');

    // Speed-based effects folder
    const speedFolder = this.gui.addFolder('Speed-Based Effects');
    
    speedFolder.add(this.particleSystem.config, 'speedBasedBrightness')
      .name('Enable Speed Brightness');
    
    speedFolder.add(this.particleSystem.config, 'brightnessMultiplier', 0.5, 5.0, 0.1)
      .name('Brightness Multiplier')
      .onChange(() => {
        this.particleSystem.updateUniforms();
      });
    
    speedFolder.add(this.particleSystem.config, 'minBrightness', 0.0, 1.0, 0.01)
      .name('Min Brightness')
      .onChange(() => {
        this.particleSystem.updateUniforms();
      });

    // Performance folder
    const performanceFolder = this.gui.addFolder('Performance');
    performanceFolder.add({ 'Show Stats': false }, 'Show Stats')
      .name('Show FPS Stats');

    // Debug folder
    const debugFolder = this.gui.addFolder('Debug');
    const debugObj = {
      'Cursor Velocity': 0,
      'Normalized Velocity': 0,
      'Speed Brightness': 0
    };
    
    debugFolder.add(debugObj, 'Cursor Velocity').listen().disable();
    debugFolder.add(debugObj, 'Normalized Velocity').listen().disable();
    debugFolder.add(debugObj, 'Speed Brightness').listen().disable();
    
    // Store debug object for updates
    (this as any).debugObj = debugObj;

    // Open the most important folders by default
    particlesFolder.open();
    speedFolder.open();
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
    const cursorVelocity = this.cursor.getNormalizedVelocity();

    // Update debug info
    if ((this as any).debugObj) {
      (this as any).debugObj['Cursor Velocity'] = this.cursor.getVelocity().toFixed(2);
      (this as any).debugObj['Normalized Velocity'] = cursorVelocity.toFixed(2);
      (this as any).debugObj['Speed Brightness'] = this.particleSystem.config.speedBasedBrightness ? 
        Math.max(this.particleSystem.config.minBrightness, cursorVelocity * this.particleSystem.config.brightnessMultiplier).toFixed(2) : '1.00';
    }

    // Emit particles at cursor position with velocity information
    this.particleSystem.emitParticles(
      cursorPos.x,
      cursorPos.y,
      window.innerWidth,
      window.innerHeight,
      cursorVelocity
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
    this.gui.destroy();
  }
}
