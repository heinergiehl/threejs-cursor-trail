import * as THREE from 'three';
import trailVertexShader from '../shaders/trail.vert.glsl?raw';
import trailFragmentShader from '../shaders/trail.frag.glsl?raw';
import displayFragmentShader from '../shaders/display.frag.glsl?raw';

export class TrailEffect {
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderTargetA: THREE.WebGLRenderTarget;
  private renderTargetB: THREE.WebGLRenderTarget;
  private trailMaterial: THREE.ShaderMaterial;
  private displayMaterial: THREE.ShaderMaterial;
  private mesh: THREE.Mesh;
  private displayMesh: THREE.Mesh;
  private displayScene: THREE.Scene;

  constructor(width: number, height: number) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const rtOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };

    this.renderTargetA = new THREE.WebGLRenderTarget(width, height, rtOptions);
    this.renderTargetB = new THREE.WebGLRenderTarget(width, height, rtOptions);

    this.trailMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: trailFragmentShader,
      uniforms: {
        uTexture: { value: null },
        uMouse: { value: new THREE.Vector2() },
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) }
      }
    });

    this.displayMaterial = new THREE.ShaderMaterial({
      vertexShader: trailVertexShader,
      fragmentShader: displayFragmentShader,
      uniforms: {
        uTexture: { value: null },
        uTime: { value: 0 }
      }
    });

    const planeGeometry = new THREE.PlaneGeometry(2, 2);
    this.mesh = new THREE.Mesh(planeGeometry, this.trailMaterial);
    this.scene.add(this.mesh);

    // Setup display scene
    this.displayScene = new THREE.Scene();
    this.displayMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      this.displayMaterial
    );
    this.displayMesh.position.z = -1;
    this.displayScene.add(this.displayMesh);
  }

  public update(
    renderer: THREE.WebGLRenderer,
    mouseX: number,
    mouseY: number,
    time: number
  ): void {
    // Update uniforms
    if (this.trailMaterial.uniforms) {
      if (this.trailMaterial.uniforms.uTime) {
        this.trailMaterial.uniforms.uTime.value = time;
      }
      if (this.trailMaterial.uniforms.uMouse) {
        this.trailMaterial.uniforms.uMouse.value.set(mouseX, mouseY);
      }
      if (this.trailMaterial.uniforms.uTexture) {
        this.trailMaterial.uniforms.uTexture.value = this.renderTargetB.texture;
      }
    }

    // Render to target A
    renderer.setRenderTarget(this.renderTargetA);
    renderer.render(this.scene, this.camera);

    // Swap targets
    const temp = this.renderTargetA;
    this.renderTargetA = this.renderTargetB;
    this.renderTargetB = temp;

    // Update display material
    if (this.displayMaterial.uniforms) {
      if (this.displayMaterial.uniforms.uTexture) {
        this.displayMaterial.uniforms.uTexture.value = this.renderTargetB.texture;
      }
      if (this.displayMaterial.uniforms.uTime) {
        this.displayMaterial.uniforms.uTime.value = time;
      }
    }
  }

  public render(renderer: THREE.WebGLRenderer, displayCamera: THREE.OrthographicCamera): void {
    renderer.render(this.displayScene, displayCamera);
  }

  public resize(width: number, height: number): void {
    this.renderTargetA.setSize(width, height);
    this.renderTargetB.setSize(width, height);
    if (this.trailMaterial.uniforms?.uResolution) {
      this.trailMaterial.uniforms.uResolution.value.set(width, height);
    }
  }

  public dispose(): void {
    this.renderTargetA.dispose();
    this.renderTargetB.dispose();
    this.trailMaterial.dispose();
    this.displayMaterial.dispose();
    this.mesh.geometry.dispose();
    this.displayMesh.geometry.dispose();
  }
}
