 import { useEffect, useRef } from "react";

interface NetworkBackgroundProps {
  color?: string;
  density?: number;
}

function NetworkBackground({ color = "34,211,238", density = 60 }: NetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // TS ला confirm karण्यासाठी नवीन const madhे store kela
    const safeCanvas: HTMLCanvasElement = canvas;
    const safeCtx: CanvasRenderingContext2D = ctx;

    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => {
      safeCanvas.width = safeCanvas.offsetWidth;
      safeCanvas.height = safeCanvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;

      constructor() {
        this.x = Math.random() * safeCanvas.width;
        this.y = Math.random() * safeCanvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > safeCanvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > safeCanvas.height) this.vy *= -1;
      }
      draw() {
        safeCtx.beginPath();
        safeCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        safeCtx.fillStyle = `rgba(${color}, 0.8)`;
        safeCtx.fill();
      }
    }

    for (let i = 0; i < density; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            safeCtx.beginPath();
            safeCtx.moveTo(particles[i].x, particles[i].y);
            safeCtx.lineTo(particles[j].x, particles[j].y);
            safeCtx.strokeStyle = `rgba(${color}, ${1 - dist / 150})`;
            safeCtx.lineWidth = 0.6;
            safeCtx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}

export default NetworkBackground;