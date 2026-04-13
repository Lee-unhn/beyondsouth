/**
 * Background Canvas Component - Beyond South 2026
 * Optimized: 2026
 */
import { useEffect, useRef } from 'react';

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#00c9b1', '#7b4fd9', '#d94faa'];
    const rn = (a: number, b: number) => Math.random() * (b - a) + a;

    class Shape {
      type: 'rect' | 'line';
      x: number;
      y: number;
      w: number;
      h: number;
      len: number;
      ang: number;
      color: string;
      speed: number;
      drift: number;
      rotation: number;
      rotationSpeed: number;
      alpha: number;
      lineWidth: number;

      constructor(init = false) {
        this.type = Math.random() < 0.62 ? 'rect' : 'line';
        this.x = rn(0, canvas!.width);
        this.y = init ? rn(0, canvas!.height) : rn(-420, -50);
        this.w = rn(55, 290);
        this.h = rn(38, 190);
        this.len = rn(60, 230);
        this.ang = rn(-Math.PI / 3.5, Math.PI / 3.5);
        this.color = colors[Math.floor(rn(0, 3))];
        this.speed = rn(0.022, 0.09);
        this.drift = rn(-0.035, 0.035);
        this.rotation = rn(0, Math.PI * 2);
        this.rotationSpeed = rn(-0.0005, 0.0005);
        this.alpha = rn(0.04, 0.16);
        this.lineWidth = rn(0.5, 1.5);
      }

      update() {
        this.y += this.speed;
        this.x += this.drift;
        this.rotation += this.rotationSpeed;
        if (this.y > canvas!.height + 420) {
          this.y = rn(-420, -50);
          this.x = rn(0, canvas!.width);
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        if (this.type === 'rect') {
          ctx.strokeRect(-this.w / 2, -this.h / 2, this.w, this.h);
        } else {
          ctx.rotate(this.ang);
          ctx.beginPath();
          ctx.moveTo(-this.len / 2, 0);
          ctx.lineTo(this.len / 2, 0);
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    const shapes: Shape[] = [];
    for (let i = 0; i < 36; i++) shapes.push(new Shape(true));

    let animationFrameId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      shapes.forEach((shape) => {
        shape.update();
        shape.draw();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none opacity-35"
      id="bg-canvas"
    />
  );
}
