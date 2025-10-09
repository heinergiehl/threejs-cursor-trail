import gsap from 'gsap';

export class Cursor {
  private element: HTMLElement;
  private currentX: number = 0;
  private currentY: number = 0;
  private targetX: number = 0;
  private targetY: number = 0;
  private smoothness: number = 0.15;

  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'cursor';
    document.body.appendChild(this.element);
    
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    document.addEventListener('mousemove', this.onMouseMove.bind(this));
  }

  private onMouseMove(event: MouseEvent): void {
    this.targetX = event.clientX;
    this.targetY = event.clientY;
    
    // Smooth cursor follow using GSAP
    gsap.to(this.element, {
      x: this.targetX - 10,
      y: this.targetY - 10,
      duration: 0.3,
      ease: 'power2.out'
    });
  }

  public update(): void {
    // Smooth interpolation for reading position
    this.currentX += (this.targetX - this.currentX) * this.smoothness;
    this.currentY += (this.targetY - this.currentY) * this.smoothness;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.currentX, y: this.currentY };
  }

  public getTargetPosition(): { x: number; y: number } {
    return { x: this.targetX, y: this.targetY };
  }

  public dispose(): void {
    this.element.remove();
  }
}
