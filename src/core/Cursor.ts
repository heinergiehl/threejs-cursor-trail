import gsap from 'gsap';

export class Cursor {
  private element: HTMLElement;
  private currentX: number = 0;
  private currentY: number = 0;
  private targetX: number = 0;
  private targetY: number = 0;
  private previousX: number = 0;
  private previousY: number = 0;
  private velocity: number = 0;
  private maxVelocity: number = 0;
  private velocitySmoothing: number = 0.1;
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
    // Store previous position for velocity calculation
    this.previousX = this.currentX;
    this.previousY = this.currentY;
    
    // Smooth interpolation for reading position
    this.currentX += (this.targetX - this.currentX) * this.smoothness;
    this.currentY += (this.targetY - this.currentY) * this.smoothness;
    
    // Calculate velocity (distance moved this frame)
    const deltaX = this.currentX - this.previousX;
    const deltaY = this.currentY - this.previousY;
    const currentVelocity = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Smooth velocity with exponential moving average
    this.velocity = this.velocity * (1 - this.velocitySmoothing) + currentVelocity * this.velocitySmoothing;
    
    // Track maximum velocity for normalization
    this.maxVelocity = Math.max(this.maxVelocity * 0.999, this.velocity); // Slowly decay max
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.currentX, y: this.currentY };
  }

  public getTargetPosition(): { x: number; y: number } {
    return { x: this.targetX, y: this.targetY };
  }

  public getVelocity(): number {
    return this.velocity;
  }

  public getNormalizedVelocity(): number {
    return this.maxVelocity > 0 ? Math.min(this.velocity / this.maxVelocity, 1) : 0;
  }

  public dispose(): void {
    this.element.remove();
  }
}
