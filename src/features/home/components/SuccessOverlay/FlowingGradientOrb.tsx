'use client';

import { useEffect, useRef } from 'react';

// Animated Liquid Flowing Gradient Orb - Premium smooth animation with subtle texture
export function FlowingGradientOrb({ canvasRef, subtle = false }: { canvasRef?: React.RefObject<HTMLCanvasElement | null>; subtle?: boolean }) {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef?.current || internalCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 200; // High resolution for quality
    canvas.width = size;
    canvas.height = size;

    let time = 0;
    // Smoother animation with eased time progression
    const timeSpeed = subtle ? 0.008 : 0.012; // Slower, smoother

    const animate = () => {
      // Smooth easing for premium feel
      time += timeSpeed;

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 10;

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Create circular clipping path
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.clip();

      // Draw flowing liquid gradient with subtle color intensity
      const imageData = ctx.createImageData(size, size);
      const data = imageData.data;

      // Color intensity multiplier - subtle mode reduces vibrancy
      const colorIntensity = subtle ? 0.35 : 0.5;
      const baseColor = subtle ? 60 : 30; // Higher base = more muted

      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          const dx = x - centerX;
          const dy = y - centerY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist <= radius) {
            const angle = Math.atan2(dy, dx);
            const normalizedDist = dist / radius;

            // Smoother flowing effect with cubic easing
            const easeTime = time * 0.8;
            const flow1 = Math.sin(angle * 1.5 + easeTime * 1.2 + normalizedDist * 2) * 0.5 + 0.5;
            const flow2 = Math.sin(angle * 2 - easeTime * 0.9 + normalizedDist * 1.5) * 0.5 + 0.5;
            const flow3 = Math.sin(angle * 1.2 + easeTime * 1.5 - normalizedDist * 2.5) * 0.5 + 0.5;
            const flow4 = Math.sin(normalizedDist * 3 - easeTime * 1.8 + angle * 0.8) * 0.5 + 0.5;

            // Blend multiple color channels for liquid effect
            const blend = (flow1 + flow2 + flow3 + flow4) / 4;
            const blend2 = (flow1 * 0.6 + flow2 * 0.4 + flow3 * 0.3) / 1.3;
            const blend3 = (flow2 * 0.5 + flow4 * 0.5);

            // Soft pastel colors for premium look
            const r = Math.floor(255 * (colorIntensity + colorIntensity * Math.sin(blend * Math.PI * 2 + 0)));
            const g = Math.floor(255 * (colorIntensity + colorIntensity * Math.sin(blend2 * Math.PI * 2 + 2)));
            const b = Math.floor(255 * (colorIntensity + colorIntensity * Math.sin(blend3 * Math.PI * 2 + 4)));

            // Smooth brightness falloff from center
            const brightness = 1 - normalizedDist * 0.25;

            const idx = (y * size + x) * 4;
            data[idx] = Math.min(255, r * brightness + baseColor);
            data[idx + 1] = Math.min(255, g * brightness + baseColor);
            data[idx + 2] = Math.min(255, b * brightness + baseColor);
            data[idx + 3] = 255;
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Add subtle film grain texture overlay for premium feel
      const grainIntensity = subtle ? 8 : 12;
      const grainData = ctx.getImageData(0, 0, size, size);
      const grainPixels = grainData.data;
      for (let i = 0; i < grainPixels.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainIntensity;
        grainPixels[i] = Math.max(0, Math.min(255, grainPixels[i] + noise));
        grainPixels[i + 1] = Math.max(0, Math.min(255, grainPixels[i + 1] + noise));
        grainPixels[i + 2] = Math.max(0, Math.min(255, grainPixels[i + 2] + noise));
      }
      ctx.putImageData(grainData, 0, 0);

      // Add soft glossy reflection
      const gradient = ctx.createRadialGradient(
        centerX - radius * 0.3, centerY - radius * 0.3, 0,
        centerX, centerY, radius
      );
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(0.4, 'rgba(255, 255, 255, 0.03)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Draw subtle border ring
      ctx.strokeStyle = 'rgba(120, 120, 120, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 1, 0, Math.PI * 2);
      ctx.stroke();

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
      {/* Subtle outer glow - more muted */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-cyan-400/30 blur-xl opacity-30" />
      {/* Canvas for liquid animation */}
      <canvas
        ref={canvasRef || internalCanvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ borderRadius: '50%' }}
      />
    </div>
  );
}
