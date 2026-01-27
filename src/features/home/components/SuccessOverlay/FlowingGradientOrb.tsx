'use client';

import { useEffect, useRef } from 'react';

// Premium Gradient Orb - smooth blue gradient animation
export function FlowingGradientOrb({
  canvasRef,
  subtle = false,
}: {
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  subtle?: boolean;
}) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef?.current || internalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    let time = 0;
    const timeSpeed = subtle ? 0.025 : 0.03;

    const animate = () => {
      time += timeSpeed;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 4;

      ctx.clearRect(0, 0, size, size);

      // Create smooth gradient blobs using radial gradients
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Base gradient - light blue to white
      const baseGradient = ctx.createRadialGradient(
        centerX + Math.sin(time * 1.2) * 50,
        centerY + Math.cos(time * 1.5) * 40,
        0,
        centerX,
        centerY,
        radius
      );
      baseGradient.addColorStop(0, '#ffffff');
      baseGradient.addColorStop(0.3, '#e0f2ff');
      baseGradient.addColorStop(0.6, '#87CEEB');
      baseGradient.addColorStop(1, '#4A90D9');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, size, size);

      // Overlay gradient blob 1 - moving white highlight
      ctx.globalCompositeOperation = 'soft-light';
      const blob1X = centerX + Math.sin(time * 1.8) * 60;
      const blob1Y = centerY + Math.cos(time * 1.4) * 50;
      const gradient1 = ctx.createRadialGradient(
        blob1X,
        blob1Y,
        0,
        blob1X,
        blob1Y,
        radius * 0.8
      );
      gradient1.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      gradient1.addColorStop(0.4, 'rgba(255, 255, 255, 0.4)');
      gradient1.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, size, size);

      // Overlay gradient blob 2 - deep blue accent
      ctx.globalCompositeOperation = 'multiply';
      const blob2X = centerX + Math.cos(time * 1.3) * 70;
      const blob2Y = centerY + Math.sin(time * 2.0) * 55;
      const gradient2 = ctx.createRadialGradient(
        blob2X,
        blob2Y,
        0,
        blob2X,
        blob2Y,
        radius * 0.9
      );
      gradient2.addColorStop(0, 'rgba(30, 144, 255, 0.5)');
      gradient2.addColorStop(0.5, 'rgba(65, 105, 225, 0.3)');
      gradient2.addColorStop(1, 'rgba(100, 149, 237, 0)');
      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, size, size);

      // Third blob - lighter accent
      ctx.globalCompositeOperation = 'screen';
      const blob3X = centerX + Math.sin(time * 2.2 + 2) * 55;
      const blob3Y = centerY + Math.cos(time * 1.6 + 1) * 60;
      const gradient3 = ctx.createRadialGradient(
        blob3X,
        blob3Y,
        0,
        blob3X,
        blob3Y,
        radius * 0.6
      );
      gradient3.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      gradient3.addColorStop(0.5, 'rgba(135, 206, 235, 0.3)');
      gradient3.addColorStop(1, 'rgba(135, 206, 235, 0)');
      ctx.fillStyle = gradient3;
      ctx.fillRect(0, 0, size, size);

      ctx.restore();

      // Subtle outer glow
      ctx.globalCompositeOperation = 'source-over';
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        radius - 10,
        centerX,
        centerY,
        radius + 5
      );
      glowGradient.addColorStop(0, 'rgba(135, 206, 235, 0)');
      glowGradient.addColorStop(0.8, 'rgba(135, 206, 235, 0.1)');
      glowGradient.addColorStop(1, 'rgba(135, 206, 235, 0)');
      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
      ctx.fill();

      // Subtle inner highlight for 3D effect
      const highlightGradient = ctx.createRadialGradient(
        centerX - radius * 0.3,
        centerY - radius * 0.3,
        0,
        centerX,
        centerY,
        radius
      );
      highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
      highlightGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.05)');
      highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      if (!prefersReducedMotion) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [canvasRef, subtle, prefersReducedMotion]);

  return (
    <div className="relative w-24 h-24">
      <canvas
        ref={canvasRef || internalCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
}
